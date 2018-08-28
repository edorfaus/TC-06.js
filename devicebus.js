class DeviceBus extends Bus
{
	constructor(addressBits, dataBits) {
		super(addressBits, dataBits);
	}
	attachDevice(startAddress, addressCount, device) {
		if (!device || !device.getData || !device.setData) {
			throw new Error('Invalid device given to DeviceBus.attachDevice');
		}
		return super.attachDevice(startAddress, addressCount, device);
	}
	getData(address, data) {
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.getData(data);
		}
	}
	setData(address, data) {
		if (data < 0 || data > this._maxData) {
			throw new Error('Invalid device bus write: data out of range');
		}
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.setData(data);
		}
	}
}
