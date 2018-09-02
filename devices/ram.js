class RAM extends EventEmitter
{
	constructor(addressBits, dataBits) {
		super('write');
		if (addressBits < 1 || addressBits > 32) {
			throw new Error('RAM address bits out of range (must be 1-32)');
		}
		if (dataBits < 1) {
			throw new Error('RAM data bits out of range (must be above 0)');
		}
		this._addressBits = addressBits;
		this._dataBits = dataBits;
		this._maxAddress = Math.pow(2, addressBits) - 1;
		this._maxValue = Math.pow(2, dataBits) - 1;
		this._data = new Array(this._maxAddress + 1).fill(0);
	}
	get maxAddress() {
		return this._maxAddress;
	}
	get maxValue() {
		return this._maxValue;
	}
	read(address) {
		if (address < 0 || address > this._maxAddress) {
			throw new Error('RAM read failed: address out of range');
		}
		return this._data[address];
	}
	write(address, value) {
		if (address < 0 || address > this._maxAddress) {
			throw new Error('RAM write failed: address out of range');
		}
		if (value < 0 || value > this._maxValue) {
			throw new Error('RAM write failed: data value out of range');
		}
		this._data[address] = value;
		if (EventEmitter.hasListener(this, 'write')) {
			let _this = this;
			let event = {
				get memory() { return _this; },
				get address() { return address; },
				get value() { return value; }
			};
			EventEmitter.emit(this, 'write', event);
		}
		return true;
	}
}
