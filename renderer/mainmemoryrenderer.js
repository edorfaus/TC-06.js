class MainMemoryRenderer extends MemoryRenderer
{
	constructor(container, uiManager) {
		super(container, uiManager);
		this._onAttachDevice = this._onAttachDevice.bind(this);
	}
	link(memory) {
		if (this._memory) {
			this._memory.off('attach-device', this._onAttachDevice);
		}

		super.link(memory);

		if (this._memory) {
			this._memory.on('attach-device', this._onAttachDevice);
		}
	}
	_updateDataInput(input, address, value, formatter) {
		input.readOnly = typeof value === 'undefined';
		if (input.readOnly) {
			input.value = 'Unassigned';
			input.classList.remove('error');
			this._dataInputValues.set(input, value);
		} else {
			super._updateDataInput(input, address, value, formatter);
		}
	}
	_onAttachDevice(e) {
		let startAddress = e.startAddress, endAddress = e.endAddress;
		let inputAddresses = this._dataInputAddresses;
		let formatter = this._getFormatter();
		for (let input of this._existingDataInputs()) {
			let address = inputAddresses.get(input);
			if (address >= startAddress && address <= endAddress) {
				let value = this._memory.read(address);
				this._updateDataInput(input, address, value, formatter);
			}
		}
	}
}
