// 0101 SETDATA <4b: target port> <2b: flag> <22b: data, depends on flag>
Operations.TC_06.SetData = class SetData {
	constructor(
		deviceBus, memory, registers, programCounter, targetValueRange
	) {
		this._deviceBus = deviceBus;
		this._registers = registers;
		this._memory = memory;
		this._programCounter = programCounter;
		this._targetValueRange = targetValueRange;

		this._constantValueShift = targetValueRange.bitsTwosComplement - 22;
		this._constantValueShift = Math.max(0, this._constantValueShift);
	}
	run(instruction) {
		let port = (instruction >>> 24) & 0x0000000F;
		let flag = (instruction >>> 22) & 0x00000003;
		let value;
		switch (flag) {
			case 0: {
				value = (instruction & 0x003FFFFF) << this._constantValueShift;
				value = this._targetValueRange.fix(value);
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
					address = this._memory.addressRange.max - address;
				}
				value = this._memory.read(address);
				break;
			}
			case 3: {
				let register = (instruction >>> 18) & 0x0000000F;
				value = this._registers.read(register);

				let extended = (instruction >>> 17) & 0x00000001;
				if (extended != 0) {

					let register2 = (instruction >>> 13) & 0x0000000F;
					let value2 = this._registers.read(register2);

					this._deviceBus.setDataExtended(port, value, value2);

					return OperationState.NEXT;
				}
				break;
			}
			default: throw new Error('Invalid SETDATA flag: ' + flag);
		}

		this._deviceBus.setData(port, value);

		return OperationState.NEXT;
	}
}
