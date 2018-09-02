class SystemControls
{
	constructor(container) {
		this._container = container;
		this._clock = null;

		this._frequencyInput = document.createElement('input');
		this._runInput = document.createElement('input');
		this._stepButton = document.createElement('input');

		this._onSetFrequency = this._onSetFrequency.bind(this);
		this._onSetRunning = this._onSetRunning.bind(this);

		this._render();
	}
	link(clock) {
		if (this._clock) {
			this._clock.off('set-frequency', this._onSetFrequency);
			this._clock.off('set-running', this._onSetRunning);
		}
		this._clock = clock;
		if (this._clock) {
			this._clock.on('set-frequency', this._onSetFrequency);
			this._clock.on('set-running', this._onSetRunning);
		}
	}
	_onSetFrequency(e) {
		this._frequencyInput.value = e.frequency;
	}
	_onSetRunning(e) {
		this._runInput.checked = e.running;
	}
	_findId(baseId) {
		let id = baseId;
		if (document.getElementById(id)) {
			id += '-';
			let num = 1;
			while (document.getElementById(id + num)) {
				num++;
			}
			id += num;
		}
		return id;
	}
	_render() {
		this._container.innerHTML = '';

		let div = document.createElement('div');
		this._container.appendChild(div);

		let label = document.createElement('label');
		label.appendChild(document.createTextNode('Frequency: '));
		div.appendChild(label);

		this._frequencyInput.type = 'number';
		this._frequencyInput.min = 1;
		this._frequencyInput.step = 1;
		this._frequencyInput.value = 60;
		div.appendChild(this._frequencyInput);

		let id = this._findId(this._container.id + '-frequency');
		this._frequencyInput.id = id;
		label.htmlFor = id;

		this._frequencyInput.addEventListener('change', (e) => {
			let value = this._frequencyInput.value;
			if (!/^[0-9]*.?[0-9]+$/.test(value)) {
				this._frequencyInput.classList.add('error');
				return;
			}
			value = Number.parseFloat(value);
			if (!isFinite(value) || value <= 0) {
				this._frequencyInput.classList.add('error');
				return;
			}
			this._frequencyInput.classList.remove('error');
			this._clock.frequency = value;
		}, false);

		div = document.createElement('div');
		this._container.appendChild(div);

		this._runInput.type = 'checkbox';
		div.appendChild(this._runInput);

		label = document.createElement('label');
		label.appendChild(document.createTextNode('Run'));
		div.appendChild(label);

		id = this._findId(this._container.id + '-run');
		this._runInput.id = id;
		label.htmlFor = id;

		this._runInput.addEventListener('change', (e) => {
			this._clock.running = this._runInput.checked;
		}, false);

		this._stepButton.type = 'button';
		this._stepButton.value = 'Single step';
		this._container.appendChild(this._stepButton);

		this._stepButton.addEventListener('click', (e) => {
			this._clock.running = false;
			this._clock.tick();
		}, false);
	}
}
