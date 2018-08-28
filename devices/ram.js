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
		this._maxAddress = Math.pow(2, addressBits) - 1;
		this._maxValue = Math.pow(2, dataBits) - 1;
		this._data = new Array(this._maxAddress + 1).fill(0);
		this._listeners = [];
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
		let oldValue = this._data[address];
		this._data[address] = value;
		if (value !== oldValue && this._listeners.length != 0) {
			let event = {
				instance: this,
				address: address,
				oldValue: oldValue,
				newValue: value
			};
			for (let listener of this._listeners) {
				listener.call(this, event);
			}
		}
		return true;
	}
	on(event, listener) {
		if (event === 'change') {
			this._listeners.push(listener);
		}
	}
}
