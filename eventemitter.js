let EventEmitter = (() => {
	let eventHandlers = new WeakMap();
	class EventEmitter {
		constructor(...knownEvents) {
			let handlers = new Map();
			for (let event of knownEvents) {
				handlers.set(event, null);
			}
			eventHandlers.set(this, handlers);
		}
		on(event, handler) {
			let handlers = eventHandlers.get(this).get(event);
			if (handlers === null) {
				handlers = new Set();
				eventHandlers.get(this).set(event, handlers);
			}
			if (handlers) {
				handlers.add(handler);
			}
			return this;
		}
		off(event, handler) {
			let handlers = eventHandlers.get(this).get(event);
			if (handlers) {
				handlers.delete(handler);
			}
			return this;
		}
		static emit(obj, event, ...args) {
			let handlers = eventHandlers.get(obj).get(event);
			if (handlers && handlers.size > 0) {
				// Copy for consistency in case one handler removes another
				let currentHandlers = new Set(handlers);
				for (let handler of currentHandlers) {
					try {
						handler(...args);
					} catch (e) {
						console.warn('Error thrown from event handler:', e);
					}
				}
			}
		}
		static hasListener(obj, event) {
			let handlers = eventHandlers.get(obj).get(event);
			return handlers && handlers.size > 0;
		}
	}
	return EventEmitter;
})();
