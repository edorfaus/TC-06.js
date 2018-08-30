class TableScreenRenderer
{
	constructor(screen, tableElement) {
		this._screen = screen;
		this._table = tableElement;
		this._cells = [];
		this._initTable();
		this._shift = 32 - this._screen.colorBits;
	}
	_initTable() {
		this._table.innerHTML = '';
		this._table.classList.add('screen-table');
		let tbody = document.createElement('tbody');
		this._table.appendChild(tbody);
		let xSize = Math.pow(2, this._screen.xBits);
		let ySize = Math.pow(2, this._screen.yBits);
		let vram = this._screen.videoMemory;
		let cells = this._cells;
		for (let y = 0; y < ySize; y++) {
			let tr = document.createElement('tr');
			tbody.appendChild(tr);
			for (let x = 0; x < xSize; x++) {
				let td = document.createElement('td');
				tr.appendChild(td);
				let address = x * ySize + y;
				let color = vram.read(address) >>> this._shift;
				td.classList.add('color-' + color);
				cells[address] = td;
			}
		}
	}
	link() {
		this._screen.videoMemory.on('change', e => this.onChange(e));
	}
	onChange(e) {
		let oldColor = e.oldValue >>> this._shift;
		let newColor = e.newValue >>> this._shift;
		let cell = this._cells[e.address];
		cell.classList.remove('color-' + oldColor);
		cell.classList.add('color-' + newColor);
	}
}
