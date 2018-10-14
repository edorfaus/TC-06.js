// 0111 SET <4b: register> <2b: startPos> <8b: data> <14b: ignored>
Operations.TC_06.Set = class Set {
	constructor(registers, targetValueRange) {
		this._registers = registers;
		this._targetValueRange = targetValueRange;
	}
	run(instruction) {
		let register = (instruction >>>24) & 0x0000000F;
		let startPos = (instruction >>>22) & 0x00000003;
		let newData = (instruction >>>14) & 0x000000FF;

		let value = this._registers.read(register);

		switch (startPos) {
			case 0: value = (value & 0x00FFFFFF) | (newData << 24); break;
			case 1: value = (value & 0xFF00FFFF) | (newData << 16); break;
			case 2: value = (value & 0xFFFF00FF) | (newData << 8); break;
			case 3: value = (value & 0xFFFFFF00) | newData; break;
			default: throw new Error('Invalid SET startPos: ' + startPos);
		}

		// Ensure the result is with our target value range.
		value = this._targetValueRange.fix(value);

		this._registers.write(register, value);

		return OperationState.NEXT;
	}
}
