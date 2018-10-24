let MemoryRenderer = (() => {
	let valueFormatters = new Map();

	class MemoryRenderer
	{
		static get valueFormatters() {
			return valueFormatters;
		}
		constructor(container, uiManager) {
			this._container = container;
			this._uiManager = uiManager;
			this._memory = null;
			this._headerDiv = document.createElement('div');
			this._dataDiv = document.createElement('div');
			this._rangeInput = document.createElement('input');
			this._currentRange = [[0, 0]];
			this._dataInputAddresses = new WeakMap();
			this._dataInputValues = new WeakMap();

			this._onInputChange = this._onInputChange.bind(this);

			this._headerDiv.className = 'header';
			this._dataDiv.className = 'data';
			this._rangeInput.className = 'range';

			this._rangeInput.type = 'text';
			this._rangeInput.value = '0';

			// This also sets the ID on the container, if necessary.
			this._setId(this._rangeInput, '-range');

			this._container.classList.add('memory');
			this._container.appendChild(this._headerDiv);
			this._container.appendChild(this._dataDiv);

			this._container.addEventListener('change', this._onInputChange);

			this._renderHeader();
		}
		link(memory) {
			if (memory === this._memory) {
				return;
			}

			this._memory = memory ? memory : null;

			if (this._memory) {
				this._currentRange = [
					[0, Math.max(0, Math.min(31, this._memory.addressRange.max))]
				];
				this._rangeInput.value = this._currentRange[0].join(':');
			}

			this._renderHeader();
			this._renderData();
		}
		refresh() {
			let inputAddresses = this._dataInputAddresses;
			let inputValues = this._dataInputValues;
			let memory = this._memory;
			let formatter = this._getFormatter();
			for (let input of this._existingDataInputs()) {
				let address = inputAddresses.get(input);
				let oldValue = inputValues.get(input);
				let newValue = memory.read(address);
				if (newValue !== oldValue) {
					this._updateDataInput(input, address, newValue, formatter);
				}
			}
		}
		_setId(element, suffix) {
			let baseId = this._container.id;
			if (!baseId) {
				baseId = Util.findFreeId('memory');
				this._container.id = baseId;
			}
			if (!element.id) {
				element.id = Util.findFreeId(baseId + suffix);
			}
			return element.id;
		}
		_renderHeader() {
			let headerDiv = this._headerDiv;

			if (!this._memory) {
				headerDiv.textContent = 'No memory attached to renderer';
				return;
			}

			headerDiv.innerHTML = '';

			let line = headerDiv.appendChild(document.createElement('div'));
			line.textContent = 'Max address: ' + this._memory.addressRange.max;

			line = headerDiv.appendChild(document.createElement('ul'));
			let li, input, label;

			/* TODO: Implement save/load
			for (let buttonText of ['Save', 'Load']) {
				let li = line.appendChild(document.createElement('li'));
				let button = li.appendChild(document.createElement('button'));
				button.type = 'button';
				button.textContent = buttonText;
				button.className = buttonText.toLowerCase();
			}

			li = line.appendChild(document.createElement('li'));
			input = li.appendChild(document.createElement('input'));
			label = li.appendChild(document.createElement('label'));
			input.type = 'checkbox';
			label.htmlFor = this._setId(input, '-save-range');
			label.textContent = 'Range';
			input.title = 'Save/load only from/to the currently set range.';
			label.title = input.title;
			*/

			line = headerDiv.appendChild(document.createElement('div'));
			label = line.appendChild(document.createElement('label'));
			line.appendChild(this._rangeInput);
			line.className = 'field';
			label.textContent = 'Range:';
			label.htmlFor = this._setId(this._rangeInput, '-range');

			line = headerDiv.appendChild(document.createElement('ul'));
			this._setId(line, '-formatter');
			let first = true;
			for (let labelText of valueFormatters.keys()) {
				li = line.appendChild(document.createElement('li'));
				input = li.appendChild(document.createElement('input'));
				label = li.appendChild(document.createElement('label'));
				input.type = 'radio';
				input.className = 'formatter';
				input.name = line.id;
				input.value = labelText;
				input.checked = first;
				label.textContent = labelText;
				label.htmlFor = this._setId(input, '-' + input.value);
				first = false;
			}
		}
		_renderData() {
			let memory = this._memory;
			let dataDiv = this._dataDiv;
			if (!memory) {
				dataDiv.innerHTML = '';
				return;
			}
			let formatter = this._getFormatter();
			let inputAddresses = this._dataInputAddresses;
			let addressBits = memory.addressRange.bitsTwosComplement;
			let addressLengthHex = Math.ceil(addressBits / 4);
			let inputIter = this._existingDataInputs();
			for (let address of this._rangeAddresses()) {
				let input = inputIter.next().value;
				if (!input) {
					input = document.createElement('input');
					input.type = 'text';
					dataDiv.appendChild(input);
				}

				let addressHex = address.toString(16).toUpperCase();
				addressHex = addressHex.padStart(addressLengthHex, '0');
				input.title = 'Address 0x' + addressHex + ' = ' + address;

				inputAddresses.set(input, address);
				let value = memory.read(address);
				this._updateDataInput(input, address, value, formatter);
			}
			// Remove any extraneous inputs
			let inputValues = this._dataInputValues;
			for (let input of inputIter) {
				dataDiv.removeChild(input);
				inputAddresses.delete(input);
				inputValues.delete(input);
			}
		}
		_updateAllDataInputs() {
			let inputAddresses = this._dataInputAddresses;
			let formatter = this._getFormatter();
			for (let input of this._existingDataInputs()) {
				let address = inputAddresses.get(input);
				let value = this._memory.read(address);
				this._updateDataInput(input, address, value, formatter);
			}
		}
		_updateDataInput(input, address, value, formatter) {
			if (typeof value === 'number') {
				input.value = formatter.format(value, this._memory);
				input.classList.remove('error');
			} else {
				input.value = 'Read failed';
				input.classList.add('error');
			}
			this._dataInputValues.set(input, value);
		}
		_getFormatter() {
			for (let el of this._headerDiv.getElementsByClassName('formatter')) {
				if (el.checked) {
					let formatter = valueFormatters.get(el.value);
					if (formatter) {
						return formatter;
					}
				}
			}
			return valueFormatters.values().next().value;
		}
		_parseRange(range) {
			range = range.trim();
			let regex = /\s*(0[xX][0-9a-fA-F]+|[0-9]+)(:(0[xX][0-9a-fA-F]+|[0-9]+))?\s*,?/y
			let result = regex.exec(range);
			let lastIndex = regex.lastIndex;
			let ranges = [];
			while (result) {
				let first = result[1], second;
				if (first[1] === 'x' || first[1] === 'X') {
					first = Number.parseInt(first, 16);
				} else {
					first = Number.parseInt(first, 10);
				}
				if (typeof result[3] === 'undefined') {
					second = first;
				} else {
					second = result[3];
					if (second[1] === 'x' || second[1] === 'X') {
						second = Number.parseInt(second, 16);
					} else {
						second = Number.parseInt(second, 10);
					}
				}
				ranges.push([first, second]);
				lastIndex = regex.lastIndex;
				result = regex.exec(range);
			}
			return lastIndex === range.length ? ranges : null;
		}
		*_rangeAddresses() {
			for (let range of this._currentRange) {
				let value = range[0];
				let last = range[1];
				if (value > last) {
					while (value > last) {
						yield value;
						value--;
					}
				} else {
					while (value < last) {
						yield value;
						value++;
					}
				}
				if (value == last) {
					yield value;
				}
			}
		}
		*_existingDataInputs() {
			let input = this._dataDiv.firstChild;
			while (input) {
				// Grab the next one first in case the current one is removed.
				let next = input.nextSibling;
				if (
					input.nodeType === Node.ELEMENT_NODE
					&& input.tagName === 'INPUT'
					&& input.type === 'text'
				) {
					yield input;
				} else {
					// Unexpected node, remove it and try the next one instead.
					this._dataDiv.removeChild(input);
				}
				input = next;
			}
		}
		_onInputChange(e) {
			let input = e.target;
			if (input === this._rangeInput) {
				let range = this._parseRange(input.value);
				if (range !== null) {
					if (range.length == 0) {
						range = [[0, 0]];
					}
					let max = this._memory.addressRange.max;
					let count = 0;
					for (let r of range) {
						if (r[0] < 0 || r[0] > max || r[1] < 0 || r[1] > max) {
							range = null;
							break;
						}
						count += Math.max(r[0], r[1]) - Math.min(r[0], r[1]) + 1;
					}
					if (count > 128) {
						// Too many addresses to show at the same time.
						range = null;
					}
				}
				if (range === null) {
					input.classList.add('error');
				} else {
					input.classList.remove('error');
					this._currentRange = range;
					this._renderData();
				}
				return;
			}
			if (input.classList.contains('formatter')) {
				this._updateAllDataInputs();
				return;
			}
			if (this._dataInputAddresses.has(input)) {
				let formatter = this._getFormatter();
				let value = formatter.parse(input.value, this._memory);
				if (value === null) {
					input.classList.add('error');
				} else {
					let address = this._dataInputAddresses.get(input);
					try {
						this._memory.write(address, value);
						input.classList.remove('error');
					} catch (e) {
						input.classList.add('error');
						if (console && console.warn) {
							console.warn('Memory write failed', e);
						}
					}
					this._uiManager.triggerRefresh();
				}
				return;
			}
		}
	}

	return MemoryRenderer;
})();

MemoryRenderer.valueFormatters.set('Bin', {
	format(value, memory) {
		let bits = memory.valueRange.bitsTwosComplement;
		if (value < 0) {
			value += Math.pow(2, bits);
		}
		return value.toString(2).padStart(bits, '0');
	},
	parse(value, memory) {
		let bits = memory.valueRange.bitsTwosComplement;
		if (value.length === bits && /^[01]+$/.test(value)) {
			let result = Number.parseInt(value, 2);
			if (memory.valueRange.min < 0 && value.startsWith("1")) {
				result -= Math.pow(2, bits);
			}
			return result;
		}
		return null;
	}
});
MemoryRenderer.valueFormatters.set('Hex', {
	format(value, memory) {
		let bits = memory.valueRange.bitsTwosComplement;
		let width = Math.ceil(bits / 4);
		if (value < 0) {
			value += Math.pow(2, bits);
		}
		return value.toString(16).toUpperCase().padStart(width, '0')
	},
	parse(value, memory) {
		let bits = memory.valueRange.bitsTwosComplement;
		let width = Math.ceil(bits / 4);
		if (value.length === width && /^[0-9a-fA-F]+$/.test(value)) {
			let result = Number.parseInt(value, 16);
			if (memory.valueRange.min < 0 && result >= Math.pow(2, bits - 1)) {
				result -= Math.pow(2, bits);
			}
			return result;
		}
		return null;
	}
});
MemoryRenderer.valueFormatters.set('Dec', {
	format(value, memory) {
		return value.toString(10);
	},
	parse(value, memory) {
		if (/^-?\d+$/.test(value)) {
			return Number.parseInt(value, 10);
		}
		return null;
	}
});
