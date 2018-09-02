class Clock extends EventEmitter
{
	constructor() {
		super('tick');
		this._frequency = 60;
		this._interval = 1000 / this._frequency;
		this._intervalID = null;
		this._lastTick = null;
		this._timerCallback = this._timerCallback.bind(this);
	}
	tick() {
		EventEmitter.emit(this, 'tick');
	}
	get frequency() {
		return this._frequency;
	}
	set frequency(frequency) {
		if (!Number.isFinite(frequency) || frequency <= 0) {
			throw new Error('Invalid frequency: must be finite and above 0');
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
		if (running === this.running) {
			return;
		}
		if (this._intervalID !== null) {
			clearInterval(this._intervalID);
			this._intervalID = null;
			this._lastTick = null;
		}
		if (running) {
			this._intervalID = setInterval(this._timerCallback, this._interval);
			this._lastTick = performance.now();
			this.tick();
		}
	}
	_timerCallback() {
		let interval = this._interval;
		let now = performance.now();
		// Catch up to how many ticks we should have had in this timer period
		let nextTick = this._lastTick + interval;
		while (nextTick < now) {
			this.tick();
			this._lastTick = nextTick;
			nextTick += interval;
		}
		// Check if it's closer to do the next tick now instead of next time
		if (nextTick - now < interval / 2) {
			this.tick();
			this._lastTick = nextTick;
		}
	}
}
