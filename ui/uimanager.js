let UIManager = (() => {
	let components = new WeakMap();
	let refreshing = new WeakMap();

	function doRefresh(manager) {
		if (refreshing.get(manager) === null) {
			return;
		}
		refreshing.set(manager, true);
		for (let component of components.get(manager)) {
			try {
				if (component.refresh) {
					component.refresh();
				}
			} catch (e) {
				console.warn('Error thrown from UI component refresh:', e);
			}
		}
		refreshing.set(manager, null);
	}

	class UIManager {
		constructor() {
			components.set(this, new Set());
			refreshing.set(this, null);
		}
		triggerRefresh() {
			let state = refreshing.get(this);
			if (state === null) {
				let promise = Promise.resolve().then(() => doRefresh(this));
				refreshing.set(this, promise);
			} else if (state === true) {
				throw new Error('Cannot trigger a refresh during a refresh.');
			}
			return this;
		}
		add(component) {
			if (refreshing.get(this) === true) {
				throw new Error('Cannot add components during a refresh.');
			}
			components.get(this).add(component);
			return this;
		}
		remove(component) {
			if (refreshing.get(this) === true) {
				throw new Error('Cannot remove components during a refresh.');
			}
			components.get(this).delete(component);
			return this;
		}
	}
	return UIManager;
})();
