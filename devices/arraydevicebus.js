class ArrayDeviceBus {
	constructor(devices, portRange = null) {
		if (!devices || !devices.length || devices.length < 1) {
			throw new Error('Invalid device array, must have a device in it');
		}
		if (!portRange) {
			portRange = new ThrowingRange(0, devices.length - 1, 'Invalid port');
		} else if (portRange.min < 0) {
			throw new Error('The given port range cannot allow negative ports');
		}
		this._portRange = portRange;
		this._devices = devices;
	}
	_getDeviceAt(givenPort) {
		let port = this._portRange.fix(givenPort);
		let device = this._devices[port];
		if (device) {
			return device;
		}
		throw new Error('No device is assigned to port ' + givenPort);
	}
	getData(port, data) {
		return this._getDeviceAt(port).getData(data);
	}
	setData(port, data) {
		this._getDeviceAt(port).setData(data);
	}
	setDataExtended(port, data1, data2) {
		this._getDeviceAt(port).setDataExtended(data1, data2);
	}
}
