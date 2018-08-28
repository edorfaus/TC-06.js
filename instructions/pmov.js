// 1001 PMOV <4b: source reg.> <4b: target reg.> <5b: start> <5b: end> <5b: shift> <1b: shiftBack> <4b: ignored>
class PmovInstruction
{
	run(processor, instruction) {
		let sourceReg = (instruction >>> 24) & 0x0000000F;
		let targetReg = (instruction >>> 20) & 0x0000000F;
		let startBit = (instruction >>> 15) & 0x0000001F;
		let endBit = (instruction >>> 10) & 0x0000001F;
		let shiftLen = (instruction >>> 5) & 0x0000001F;
		let direction = (instruction >>> 4) & 0x00000001;

		if (startBit > endBit) {
			return Processor.RUN_ERROR;
		}

		let sourceValue = processor.registers.read(sourceReg);
		if (typeof sourceValue === 'undefined') {
			return Processor.RUN_ERROR;
		}
		let targetValue = 0;
		if (endBit - startBit < 31) {
			targetValue = processor.registers.read(targetReg);
			if (typeof targetValue === 'undefined') {
				return Processor.RUN_ERROR;
			}
		}

		let sourceStr = (sourceValue >>> 0).toString(2).padStart(32, '0');
		let targetStr = (targetValue >>> 0).toString(2).padStart(32, '0');

		let temp = sourceStr.substring(startBit, endBit + 1);
		if (shiftLen == 0) {

			let prefix = targetStr.substring(0, startBit);
			let suffix = targetStr.substring(endBit + 1);
			targetStr = prefix + temp + suffix;

		} else {
	
			if (direction == 1) {
				shiftLen = 32 - shiftLen;
			}
			temp = ''.padEnd(startBit, 'a') + temp + ''.padEnd(31 - endBit, 'a');
			temp = temp.substring(shiftLen) + temp.substring(0, shiftLen);

			let match = /^(a*)([01]+)(a*)([01]*)$/.exec(temp);
			if (!match) {
				throw new Error('PMOV shift regex failed to match: ' + temp);
			}
			temp = targetStr.substring(0, match[1].length) + match[2];
			temp += targetStr.substring(temp.length, temp.length + match[3].length);
			targetStr = temp + match[4];
		}

		targetValue = parseInt(targetStr, 2);

		let result = processor.registers.write(targetReg, targetValue);
		if (typeof result === 'undefined') {
			return Processor.RUN_ERROR;
		}

		return Processor.RUN_DONE;
	}
}
