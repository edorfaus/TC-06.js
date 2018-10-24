class ArrayMemory {
	constructor(addressRange, valueRange) {
		if (addressRange.min !== 0) {
			throw new Error('Address range for ArrayMemory must start at 0');
		}
		this._addressRange = addressRange;
		this._valueRange = valueRange;
		let defaultValue = valueRange.includes(0) ? 0 : valueRange.min;
		this._data = new Array(this._addressRange.size).fill(defaultValue);
	}
	static forBits(addressBits, valueRange) {
		if (addressBits < 1 || addressBits > 32) {
			throw new Error('Address bits out of range (must be 1-32)');
		}
		let addressRange = new ThrowingRange(
			0, Math.pow(2, addressBits) - 1, 'Address out of range'
		);
		return new ArrayMemory(addressRange, valueRange);
	}
	get addressRange() {
		return this._addressRange;
	}
	get valueRange() {
		return this._valueRange;
	}
	read(address) {
		address = this._addressRange.fix(address);
		return this._data[address];
	}
	write(address, value) {
		address = this._addressRange.fix(address);
		value = this._valueRange.fix(value);
		this._data[address] = value;
	}
}
