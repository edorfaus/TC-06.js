// 0101 SETDATA <4b: target port> <2b: flag> <22b: data, depends on flag>
class SetdataInstruction
{
	run(processor, instruction) {
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
				let address = processor.currentIP + offset;
				value = processor.memoryBus.read(address);
				break;
			}
			case 2: {
				// Direction 0 reads from top, 1 from bottom
				let direction = (instruction >>> 21) & 0x00000001;
				let address = instruction & 0x001FFFFF;
				if (direction == 1) {
					address = processor.memoryBus.maxAddress - address;
				}
				value = processor.memoryBus.read(address);
				break;
			}
			case 3: {
				let register = (instruction >>> 18) & 0x0000000F;
				value = processor.registers.read(register);
				break;
			}
			default: throw new Error('Invalid SETDATA flag: ' + flag);
		}
		let result = processor.deviceBus.setData(port, value);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}
		return Processor.RUN_DONE;
	}
}
