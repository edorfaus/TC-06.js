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
		if (data < 0 || data > this._maxData) {
			throw new Error('Invalid memory bus write: data out of range');
		}
		let device = this._getDeviceAt(address);
		if (device) {
			return device.device.write(address - device.startAddress, data);
		}
	}
}
