// 0010 MOVI <4b: register> <24b: address>
Operations.TC_06.MovI = class MovI {
	constructor(memory, registers) {
		this._memory = memory;
		this._registers = registers;
	}
	run(instruction) {
		let register = (instruction & 0x0F000000) >>> 24;
		let address = instruction & 0x00FFFFFF;

		let value = this._memory.read(address);

		this._registers.write(register, value);

		return OperationState.NEXT;
	}
}
