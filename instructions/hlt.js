// 0001 HLT <28b: ticks>
class HltInstruction
{
	run(processor, instruction) {
		if (processor.instructionState === null) {
			processor.instructionState = instruction & 0x0FFFFFFF;
			return Processor.RUN_AGAIN;
		}
		if (processor.instructionState === 0) {
			// Should stay on this instruction forever
			return Processor.RUN_AGAIN;
		}
		processor.instructionState--;
		if (processor.instructionState > 0) {
			return Processor.RUN_AGAIN;
		}
		return Processor.RUN_DONE;
	}
}
