class DeviceBus extends Bus
{
	constructor(addressBits, valueRange) {
		super(addressBits, valueRange);
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
		data = this._valueRange.fix(data);
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.setData(data);
		}
	}
}
