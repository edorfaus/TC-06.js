class Bus extends EventEmitter
{
	constructor(addressBits, dataBits, ...knownEvents) {
		super('attach-device', ...knownEvents);
		if (addressBits < 1) {
			throw new Error('Bus address bits out of range (must be above 0)');
		}
		if (dataBits < 1) {
			throw new Error('Bus data bits out of range (must be above 0)');
		}
		this._addressBits = addressBits;
		this._dataBits = dataBits;
		this._maxAddress = Math.pow(2, addressBits) - 1;
		this._valueRange = new ThrowingRange(
			0, Math.pow(2, dataBits) - 1, 'Data value out of bus range'
		);
		this._devices = [];
		this._maxAssignedAddress = -1;
	}
	get addressBits() {
		return this._addressBits;
	}
	get dataBits() {
		return this._dataBits;
	}
	get valueRange() {
		return this._valueRange;
	}
	get maxAddress() {
		return this._maxAddress;
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
		if (EventEmitter.hasListener(this, 'attach-device')) {
			let _this = this;
			let event = {
				get bus() { return _this; },
				get startAddress() { return startAddress; },
				get addressCount() { return addressCount; },
				get endAddress() { return endAddress; },
				get device() { return device; }
			};
			EventEmitter.emit(this, 'attach-device', event);
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
