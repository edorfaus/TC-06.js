class TableScreenRenderer
{
	constructor(tableElement) {
		this._table = tableElement;
		this._screen = null;
		this._cells = null;
		this._shift = null;
		this._onWrite = this._onWrite.bind(this);

		this._table.classList.add('screen-table');
		this._table.innerHTML = '';
	}
	link(screen) {
		if (this._screen) {
			this._screen.videoMemory.off('write', this._onWrite);
		}

		this._table.innerHTML = '';

		if (!screen) {
			this._screen = null;
			this._cells = null;
			this._shift = null;
			return;
		}

		let cells = [];

		this._screen = screen;
		this._cells = cells;
		this._shift = 32 - screen.colorBits;

		let xSize = Math.pow(2, screen.xBits);
		let ySize = Math.pow(2, screen.yBits);
		let videoMemory = screen.videoMemory;

		let tbody = document.createElement('tbody');
		this._table.appendChild(tbody);
		for (let y = 0; y < ySize; y++) {
			let tr = document.createElement('tr');
			tbody.appendChild(tr);
			for (let x = 0; x < xSize; x++) {
				let td = document.createElement('td');
				tr.appendChild(td);

				let address = x * ySize + y;

				cells[address] = td;

				let color = videoMemory.read(address) >>> this._shift;
				td.classList.add('color-' + color);
			}
		}

		videoMemory.on('write', this._onWrite);
	}
	_onWrite(e) {
		let color = e.value >>> this._shift;
		let cell = this._cells[e.address];
		cell.className = 'color-' + color;
	}
}
