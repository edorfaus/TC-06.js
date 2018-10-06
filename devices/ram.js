class RAM
{
	constructor(addressBits, dataBits) {
		if (addressBits < 1 || addressBits > 32) {
			throw new Error('RAM address bits out of range (must be 1-32)');
		}
		if (dataBits < 1) {
			throw new Error('RAM data bits out of range (must be above 0)');
		}
		this._addressBits = addressBits;
		this._dataBits = dataBits;
		this._addressRange = new ThrowingRange(
			0, Math.pow(2, addressBits) - 1, 'Address out of range'
		);
		this._valueRange = new ThrowingRange(
			0, Math.pow(2, dataBits) - 1, 'Data value out of range'
		);
		this._data = new Array(this._addressRange.size).fill(0);
	}
	get addressBits() {
		return this._addressBits;
	}
	get dataBits() {
		return this._dataBits;
	}
	get maxAddress() {
		return this._addressRange.max;
	}
	get maxValue() {
		return this._valueRange.max;
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
