class SingleWordMemory {
	constructor(valueRange) {
		this._addressRange = new DefaultingRange(0, 0, 0);
		this._valueRange = valueRange;
		this._value = 0;
	}
	get addressBits() {
		return 1;
	}
	get dataBits() {
		return this._valueRange.sizeBits;
	}
	get maxAddress() {
		return 0;
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
		return this._value;
	}
	write(address, value) {
		this._value = this._valueRange.fix(value);
		return true;
	}
}
