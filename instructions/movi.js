// 0010 MOVI <4b: register> <24b: address>
class MoviInstruction
{
	run(processor, instruction) {
		let register = (instruction & 0x0F000000) >>> 24;
		let address = instruction & 0x00FFFFFF;
		let value = processor.memoryBus.read(address);
		if (typeof value === 'undefined') {
			return Processor.RUN_ERROR;
		}
		let result = processor.registers.write(register, value);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}
		return Processor.RUN_DONE;
	}
}
