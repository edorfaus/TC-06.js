class Drive
{
	constructor(memory) {
		this._memory = memory;
		this._maxAddress = memory.maxAddress;
		this._maxValue = memory.maxValue;
		this._writeAddress = null;
	}
	getData(address) {
		if (address < 0 || address > this._maxAddress) {
			// Read failed: address out of range
			return;
		}
		return this._memory.read(address);
	}
	setData(data) {
		if (this._writeAddress === null) {
			if (data < 0 || address > this._maxAddress) {
				// Write failed: address out of range
				return false;
			}
			this._writeAddress = data;
			return true;
		}
		let address = this._writeAddress;
		this._writeAddress = null;
		if (value < 0 || value > this._maxValue) {
			// Write failed: data out of range
			return false;
		}
		return this._memory.write(address, value);
	}
}
