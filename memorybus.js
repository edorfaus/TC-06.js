class MemoryBus extends Bus
{
	constructor(addressBits, dataBits) {
		super(addressBits, dataBits);
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
		data = this._valueRange.fix(data);
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.write(address - device.startAddress, data);
		}
	}
}
