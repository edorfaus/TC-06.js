// 1000 IFJMP <2b: flag> <24b: address> <2b: operation>
Operations.TC_06.IfJmp = class IfJmp extends Operations.TC_06.Jmp {
	constructor(
		memory, registers, programCounter, register1 = 2, register2 = 3,
		instant = false
	) {
		super(memory, programCounter, instant);
		this._registers = registers;
		this._register1 = register1;
		this._register2 = register2;
	}
	run(instruction) {
		let value1 = this._registers.read(this._register1);
		let value2 = this._registers.read(this._register2);
		let operation = instruction & 0x00000003;
		let result;
		switch (operation) {
			case 0: result = (value1 == value2); break;
			case 1: result = (value1 != value2); break;
			case 2: result = (value1 > value2); break;
			case 3: result = (value1 < value2); break;
			default: throw new Error('Invalid IFJMP operation: ' + operation);
		}
		if (!result) {
			return OperationState.NEXT;
		}

		return super.run(instruction);
	}
}
