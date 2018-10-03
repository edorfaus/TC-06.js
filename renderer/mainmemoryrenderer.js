class MainMemoryRenderer extends MemoryRenderer
{
	constructor(container, uiManager) {
		super(container, uiManager);
		this._assignedMemoryDiv = document.createElement('div');
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
	_renderHeader() {
		super._renderHeader();

		if (!this._memory) {
			return;
		}

		this._updateAssignedMemoryDiv();

		let before = this._headerDiv.firstElementChild.nextElementSibling;
		this._headerDiv.insertBefore(this._assignedMemoryDiv, before);
	}
	_updateDataInput(input, address, value, formatter) {
		input.readOnly = typeof value === 'undefined';
		if (input.readOnly) {
			input.value = 'Unassigned';
			input.classList.remove('error');
		} else {
			super._updateDataInput(input, address, value, formatter);
		}
	}
	_updateAssignedMemoryDiv() {
		if (this._memory) {
			let address = this._memory.maxAssignedAddress;
			this._assignedMemoryDiv.textContent = 'Max assigned: ' + address;
		} else {
			this._assignedMemoryDiv.textContent = '';
		}
	}
	_onAttachDevice(e) {
		this._updateAssignedMemoryDiv();

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
