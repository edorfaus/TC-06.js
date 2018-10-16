// 0100 JMP <2b: flag> <24b: address> <2b: ignored>
Operations.TC_06.Jmp = class Jmp {
	constructor(memory, programCounter, instant = true) {
		this._memory = memory;
		this._programCounter = programCounter;
		this._instant = instant;
	}
	run(instruction) {
		let flag = (instruction >>> 26) & 0x00000003;
		let address = (instruction >>> 2) & 0x00FFFFFF;
		let newPC;
		switch (flag) {
			case 0: newPC = this._programCounter.read(0) + address; break;
			case 1: newPC = address; break;
			case 2: newPC = this._programCounter.read(0) - address; break;
			case 3: newPC = this._memory.addressRange.max - address; break;
			default: throw new Error('Invalid JMP flag: ' + flag);
		}
		this._programCounter.write(0, newPC);

		return this._instant ? OperationState.RUN : OperationState.DONE;
	}
}
