// 0011 MOVI <4b: register> <24b: address>
class MovoInstruction
{
	run(processor, instruction) {
		let register = (instruction & 0x0F000000) >>> 24;
		let address = instruction & 0x00FFFFFF;
		let value = processor.registers.read(register);
		if (typeof value === 'undefined') {
			return Processor.RUN_ERROR;
		}
		let result = processor.memoryBus.write(address, value);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}
		return Processor.RUN_DONE;
	}
}
