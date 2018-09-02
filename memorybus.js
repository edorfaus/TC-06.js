class MemoryBus extends Bus
{
	constructor(addressBits, dataBits) {
		super(addressBits, dataBits, 'write');
	}
	attachDevice(startAddress, addressCount, device) {
		if (!device || !device.read || !device.write) {
			throw new Error('Invalid device given to MemoryBus.attachDevice');
		}
		return super.attachDevice(startAddress, addressCount, device);
	}
	read(address) {
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.read(address - device.startAddress);
		}
	}
	write(address, data) {
		if (data < 0 || data > this._maxData) {
			throw new Error('Invalid memory bus write: data out of range');
		}
		let device = this._getDeviceAt(address);
		if (device) {
			let ret = device.device.write(address - device.startAddress, data);
			if (EventEmitter.hasListener(this, 'write')) {
				let _this = this;
				let event = {
					get memory() { return _this; },
					get address() { return address; },
					get value() { return data; }
				};
				EventEmitter.emit(this, 'write', event);
			}
			return ret;
		}
	}
}
