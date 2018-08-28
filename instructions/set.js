// 0111 SET <4b: register> <2b: startPos> <8b: data> <14b: ignored>
class SetInstruction
{
	run(processor, instruction) {
		let register = (instruction >>>24) & 0x0000000F;
		let startPos = (instruction >>>22) & 0x00000003;
		let newData = (instruction >>>14) & 0x000000FF;

		let value = processor.registers.read(register);
		if (typeof value === 'undefined') {
			return Processor.RUN_ERROR;
		}

		switch (startPos) {
			case 0: value = (value & 0x00FFFFFF) | (newData << 24); break;
			case 1: value = (value & 0xFF00FFFF) | (newData << 16); break;
			case 2: value = (value & 0xFFFF00FF) | (newData << 8); break;
			case 3: value = (value & 0xFFFFFF00) | newData; break;
			default: throw new Error('Invalid SET startPos: ' + startPos);
		}

		// Ensure it's not negative
		value = value >>> 0;

		let result = processor.registers.write(register, value);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}

		return Processor.RUN_DONE;
	}
}
