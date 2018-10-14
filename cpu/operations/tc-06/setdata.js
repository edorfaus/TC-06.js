// 0101 SETDATA <4b: target port> <2b: flag> <22b: data, depends on flag>
Operations.TC_06.SetData = class SetData {
	constructor(deviceBus, memory, registers, programCounter) {
		this._deviceBus = deviceBus;
		this._registers = registers;
		this._memory = memory;
		this._programCounter = programCounter;
	}
	run(instruction) {
		let port = (instruction >>> 24) & 0x0000000F;
		let flag = (instruction >>> 22) & 0x00000003;
		let value;
		switch (flag) {
			case 0: {
				// The right shift ensures it's not negative
				value = (instruction << 10) >>> 0;
				break;
			}
			case 1: {
				// Direction 0 reads before this instruction, 1 after
				let direction = (instruction >>> 21) & 0x00000001;
				let offset = instruction & 0x001FFFFF;
				if (direction == 0) {
					offset = -offset;
				}
				let address = this._programCounter.read(0) + offset;
				value = this._memory.read(address);
				break;
			}
			case 2: {
				// Direction 0 reads from top, 1 from bottom
				let direction = (instruction >>> 21) & 0x00000001;
				let address = instruction & 0x001FFFFF;
				if (direction == 1) {
					address = this._memory.maxAddress - address;
				}
				value = this._memory.read(address);
				break;
			}
			case 3: {
				let register = (instruction >>> 18) & 0x0000000F;
				value = this._registers.read(register);
				break;
			}
			default: throw new Error('Invalid SETDATA flag: ' + flag);
		}

		this._deviceBus.setData(port, value);

		return OperationState.NEXT;
	}
}
