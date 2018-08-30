class Bus
{
	constructor(addressBits, dataBits) {
		if (addressBits < 1) {
			throw new Error('Bus address bits out of range (must be above 0)');
		}
		if (dataBits < 1) {
			throw new Error('Bus data bits out of range (must be above 0)');
		}
		this._addressBits = addressBits;
		this._dataBits = dataBits;
		this._maxAddress = Math.pow(2, addressBits) - 1;
		this._maxData = Math.pow(2, dataBits) - 1;
		this._devices = [];
		this._maxAssignedAddress = -1;
	}
	get maxAssignedAddress() {
		return this._maxAssignedAddress;
	}
	attachDevice(startAddress, addressCount, device) {
		let endAddress = startAddress + addressCount - 1;
		if (
			startAddress < 0
			|| addressCount < 1
			|| startAddress > this._maxAddress
			|| endAddress > this._maxAddress
		) {
			throw new Error('Invalid addresses given to Bus.attachDevice');
		}
		if (!device) {
			throw new Error('Invalid device given to Bus.attachDevice');
		}
		for (let dev of this._devices) {
			if (!(startAddress > dev.endAddress || endAddress < dev.startAddress)) {
				throw new Error('Two devices have overlapping address range');
			}
		}
		this._devices.push({
			startAddress: startAddress,
			addressCount: addressCount,
			endAddress: endAddress,
			device: device
		});
		if (endAddress > this._maxAssignedAddress) {
			this._maxAssignedAddress = endAddress;
		}
		return this;
	}
	_getDeviceAt(address) {
		for (let device of this._devices) {
			if (address >= device.startAddress && address <= device.endAddress) {
				return device;
			}
		}
	}
}
