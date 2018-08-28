class Screen
{
	constructor(colorBits, xBits, yBits) {
		if (colorBits < 1 || xBits < 1 || yBits < 1) {
			throw new Error('Invalid arguments for screen: bit count below 1');
		}
		if (colorBits + xBits + yBits > 32) {
			throw new Error('Invalid arguments for screen: total bits > 32');
		}
		this._colorBits = colorBits;
		this._xBits = xBits;
		this._yBits = yBits;
		this._shift = 32 - colorBits - xBits - yBits;
		this._mask = Math.pow(2, xBits + yBits) - 1;
		this._videoMemory = new RAM(xBits + yBits, 32);
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
