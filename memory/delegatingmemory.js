class DelegatingMemory {
	constructor(devices, addressRange = null, valueRange = null) {
		if (!devices || !devices.length || devices.length < 1) {
			throw new Error('Invalid device array, must have a device in it');
		}
		let nextAddress = 0;
		let deviceList = [];
		for (let dev of devices) {
			if (!dev || !dev.read || !dev.write || !dev.addressRange) {
				throw new Error('Invalid device at index ' + deviceList.length);
			}
			let devRange = dev.addressRange;
			if (!devRange.size || devRange.size < 1) {
				throw new Error('Invalid address range for device ' + deviceList.length);
			}
			let offset = nextAddress - devRange.min;
			nextAddress += devRange.size;
			deviceList.push({
				lastAddress: nextAddress - 1,
				addressOffset: offset,
				device: dev
			});
			if (!valueRange) {
				valueRange = dev.valueRange;
			}
		}
		if (!valueRange) {
			throw new Error('Invalid devices: no valid value range');
		}
		if (!addressRange) {
			addressRange = new ThrowingRange(0, nextAddress - 1);
		} else if (addressRange.min < 0 || addressRange.max >= nextAddress) {
			throw new Error('The given address range is too large');
		}
		this._addressRange = addressRange;
		this._valueRange = valueRange;
		this._devices = deviceList;
	}
	get addressRange() {
		return this._addressRange;
	}
	get valueRange() {
		return this._valueRange;
	}
	_getDeviceAt(address) {
		for (let device of this._devices) {
			if (address <= device.lastAddress) {
				return device;
			}
		}
		throw new Error('No device is assigned to address ' + address);
	}
	read(address) {
		address = this._addressRange.fix(address);
		let device = this._getDeviceAt(address);
		return device.device.read(address - device.addressOffset);
	}
	write(address, data) {
		address = this._addressRange.fix(address);
		data = this._valueRange.fix(data);
		let device = this._getDeviceAt(address);
		return device.device.write(address - device.addressOffset, data);
	}
}
