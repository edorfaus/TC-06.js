class Clock
{
	constructor() {
		this._devices = [];
	}
	attachDevice(device) {
		if (!device || !device.tick) {
			throw new Error('Cannot add device to clock: no tick method');
		}
		this._devices.push(device);
		return this;
	}
	tick() {
		for (let device of this._devices) {
			device.tick();
		}
	}
}
