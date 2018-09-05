class Util
{
	static findFreeId(baseId) {
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
}
