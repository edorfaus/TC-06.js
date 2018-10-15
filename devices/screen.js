class Screen
{
	constructor(colorBits, xBits, yBits, totalBits, videoMemory) {
		if (colorBits < 1 || xBits < 1 || yBits < 1) {
			throw new Error('Invalid screen arguments: bit count below 1');
		}
		if (colorBits + xBits + yBits > totalBits) {
			throw new Error('Invalid screen arguments: bit sum > total bits');
		}
		if (totalBits > 32) {
			// Due to the way we use JS bitwise operations, 32 bits is max.
			throw new Error('Invalid screen arguments: total bits > 32');
		}
		if (Math.pow(2, totalBits) > videoMemory.valueRange.size) {
			throw new Error('Invalid screen arguments: memory values too small');
		}
		if (Math.pow(2, xBits + yBits) > videoMemory.addressRange.size) {
			throw new Error('Invalid screen arguments: memory size too small');
		}
		this._colorBits = colorBits;
		this._xBits = xBits;
		this._yBits = yBits;
		this._shift = totalBits - colorBits - xBits - yBits;
		this._mask = Math.pow(2, xBits + yBits) - 1;
		this._videoMemory = videoMemory;

	}
	get videoMemory() {
		return this._videoMemory;
	}
	get colorBits() {
		return this._colorBits;
	}
	get xBits() {
		return this._xBits;
	}
	get yBits() {
		return this._yBits;
	}
	_getVideoMemoryAddress(data) {
		return (data >>> this._shift) & this._mask;
	}
	getData(data) {
		let address = this._getVideoMemoryAddress(data);
		return this._videoMemory.read(address);
	}
	setData(data) {
		let address = this._getVideoMemoryAddress(data);
		return this._videoMemory.write(address, data);
	}
}
