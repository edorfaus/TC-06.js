class Clock extends EventEmitter
{
	constructor(uiManager) {
		super('tick', 'set-frequency', 'set-running', 'start', 'stop');
		this._uiManager = uiManager;
		this._frequency = 60;
		this._interval = 1000 / this._frequency;
		this._intervalID = null;
		this._lastTick = null;
		this._timerCallback = this._timerCallback.bind(this);
		let _this = this;
		this._clockOnlyEvent = {
			get clock() { return _this; }
		};
	}
	tick() {
		EventEmitter.emit(this, 'tick', this._clockOnlyEvent);
		this._uiManager.triggerRefresh();
	}
	get frequency() {
		return this._frequency;
	}
	set frequency(frequency) {
		if (!Number.isFinite(frequency) || frequency <= 0) {
			throw new Error('Invalid frequency: must be finite and above 0');
		}
		if (EventEmitter.hasListener(this, 'set-frequency')) {
			let _this = this;
			EventEmitter.emit(this, 'set-frequency', {
				get clock() { return _this; },
				get frequency() { return frequency; }
			});
		}
		if (frequency === this._frequency) {
			return;
		}
		this._frequency = frequency;
		this._interval = 1000 / frequency;
		if (this._intervalID !== null) {
			clearInterval(this._intervalID);
			this._intervalID = setInterval(this._timerCallback, this._interval);
			this._timerCallback();
		}
	}
	get running() {
		return this._intervalID !== null;
	}
	set running(running) {
		if (typeof running !== 'boolean') {
			throw new Error('Invalid type: running must be a boolean');
		}
		if (EventEmitter.hasListener(this, 'set-running')) {
			let _this = this;
			EventEmitter.emit(this, 'set-running', {
				get clock() { return _this; },
				get running() { return running; }
			});
		}
		if (running === this.running) {
			return;
		}
		if (this._intervalID !== null) {
			clearInterval(this._intervalID);
			this._intervalID = null;
		}
		this._lastTick = null;
		if (running) {
			this._intervalID = setInterval(this._timerCallback, this._interval);
			EventEmitter.emit(this, 'start', this._clockOnlyEvent);
			this._lastTick = performance.now();
			EventEmitter.emit(this, 'tick', this._clockOnlyEvent);
		} else {
			EventEmitter.emit(this, 'stop', this._clockOnlyEvent);
		}
	}
	_timerCallback() {
		let interval = this._interval;
		let now = performance.now();
		// Catch up to how many ticks we should have had in this timer period
		let nextTick = this._lastTick + interval;
		while (nextTick < now) {
			EventEmitter.emit(this, 'tick', this._clockOnlyEvent);
			this._lastTick = nextTick;
			nextTick += interval;
		}
		// Check if it's closer to do the next tick now instead of next time
		if (nextTick - now < interval / 2) {
			EventEmitter.emit(this, 'tick', this._clockOnlyEvent);
			this._lastTick = nextTick;
		}
		this._uiManager.triggerRefresh();
	}
}
