class Drive
{
	constructor(addressBits, dataBits) {
		if (addressBits < 1 || addressBits > 32) {
			throw new Error('Drive address bits out of range (must be 1-32)');
		}
		if (dataBits < 1) {
			throw new Error('Drive data bits out of range (must be above 0)');
		}
		this._addressBits = addressBits;
		this._dataBits = dataBits;
		this._maxAddress = Math.pow(2, addressBits) - 1;
		this._maxValue = Math.pow(2, dataBits) - 1;
		this._data = new Array(this._maxAddress + 1).fill(0);
		this._writeAddress = null;
	}
	getData(address) {
		if (address < 0 || address > this._maxAddress) {
			// Read failed: address out of range
			return;
		}
		return this._data[address];
	}
	setData(data) {
		if (this._writeAddress === null) {
			if (data < 0 || address > this._maxAddress) {
				// Write failed: address out of range
				return;
			}
			this._writeAddress = data;
		} else {
			let address = this._writeAddress;
			this._writeAddress = null;
			if (value < 0 || value > this._maxValue) {
				// Write failed: data out of range
				return;
			}
			this._data[address] = value;
		}
		return true;
	}
}
