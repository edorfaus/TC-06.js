class Drive
{
	constructor(memory) {
		this._memory = memory;
		this._writeAddress = null;
	}
	getData(address) {
		return this._memory.read(address);
	}
	setData(data) {
		if (this._writeAddress === null) {
			this._writeAddress = this._memory.addressRange.fix(data);
			return true;
		}
		let address = this._writeAddress;
		this._writeAddress = null;
		return this._memory.write(address, value);
	}
}
