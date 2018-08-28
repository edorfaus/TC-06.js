// 1010 MATH <4b: source reg.> <4b: target reg.> <4b: operation> <16b: ignored>
class MathInstruction
{
	run(processor, instruction) {
		let sourceReg = (instruction >>> 24) & 0x0000000F;
		let targetReg = (instruction >>> 20) & 0x0000000F;
		let operation = (instruction >>> 16) & 0x0000000F;

		let sourceValue = processor.registers.read(sourceReg);
		if (typeof sourceValue === 'undefined') {
			return Processor.RUN_ERROR;
		}
		let targetValue;
		if (operation <= 4) {
			targetValue = processor.registers.read(targetReg);
			if (typeof targetValue === 'undefined') {
				return Processor.RUN_ERROR;
			}
		}

		switch (operation) {
			case 0: targetValue += sourceValue; break;
			case 1: targetValue -= sourceValue; break;
			case 2: targetValue *= sourceValue; break;
			case 3: targetValue = ~~(targetValue / sourceValue); break;
			case 4: targetValue = (targetValue % sourceValue); break;
			case 5: targetValue = sourceValue; break;
			case 6: targetValue = Math.floor(Math.random() * Math.floor(sourceValue));
			default: throw new Error('Invalid MATH operation: ' + operation);
		}

		// Ensure it's not negative
		targetValue = targetValue >>> 0;

		let result = processor.registers.write(targetReg, targetValue);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}

		return Processor.RUN_DONE;
	}
}
