class MemoryBus extends Bus
{
	constructor(addressBits, dataBits) {
		super(addressBits, dataBits, 'change');
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
			let oldValue;
			if (EventEmitter.hasListener(this, 'change')) {
				oldValue = device.device.read(address - device.startAddress);
			}
			let ret = device.device.write(address - device.startAddress, data);
			if (data !== oldValue && EventEmitter.hasListener(this, 'change')) {
				let _this = this;
				let event = {
					get memory() { return _this; },
					get address() { return address; },
					get oldValue() { return oldValue; },
					get newValue() { return data; }
				};
				EventEmitter.emit(this, 'change', event);
			}
			return ret;
		}
	}
}
