class TableScreenRenderer
{
	constructor(tableElement) {
		this._table = tableElement;
		this._screen = null;
		this._cells = null;
		this._shift = null;

		this._table.classList.add('screen-table');
		this._table.innerHTML = '';
	}
	link(screen) {
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
	}
	refresh() {
		let cells = this._cells;
		let videoMemory = this._screen.videoMemory;
		let shift = this._shift;
		for (let address = cells.length - 1; address >= 0; address--) {
			let color = videoMemory.read(address) >>> shift;
			let className = 'color-' + color;
			let cell = cells[address];
			if (cell.className !== className) {
				cell.className = className;
			}
		}
	}
}
