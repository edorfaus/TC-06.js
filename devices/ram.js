class RAM
{
	constructor(addressBits, valueRange) {
		if (addressBits < 1 || addressBits > 32) {
			throw new Error('RAM address bits out of range (must be 1-32)');
		}
		this._addressBits = addressBits;
		this._addressRange = new ThrowingRange(
			0, Math.pow(2, addressBits) - 1, 'Address out of range'
		);
		this._valueRange = valueRange;
		this._data = new Array(this._addressRange.size).fill(0);
	}
	get addressBits() {
		return this._addressBits;
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
		return true;
	}
}
