// 1010 MATH <4b: source reg.> <4b: target reg.> <4b: operation> <16b: ignored>
Operations.TC_06.Math = class Math {
	constructor(registers, targetValueRange) {
		this._registers = registers;
		this._targetValueRange = targetValueRange;
	}
	run(instruction) {
		let sourceReg = (instruction >>> 24) & 0x0000000F;
		let targetReg = (instruction >>> 20) & 0x0000000F;
		let operation = (instruction >>> 16) & 0x0000000F;

		let sourceValue = this._registers.read(sourceReg);
		let targetValue;
		if (operation <= 4) {
			targetValue = this._registers.read(targetReg);
		}

		switch (operation) {
			case 0: targetValue += sourceValue; break;
			case 1: targetValue -= sourceValue; break;
			case 2: targetValue *= sourceValue; break;
			case 3:
				// C#'s / operator on ints does truncated division.
				targetValue = Math.trunc(targetValue / sourceValue);
				break;
			case 4:
				// C#'s % operator is remainder, not modulus. JS % is the same.
				targetValue = (targetValue % sourceValue);
				break;
			case 5: targetValue = sourceValue; break;
			case 6:
				// This operation is defined as Random.Range(0, source), and
				// Unity's Random.Range(int, int) returns min <= value < max,
				// so this should be equivalent.
				targetValue = Math.floor(Math.random() * sourceValue);
				break;
			default: throw new Error('Invalid MATH operation: ' + operation);
		}

		// Ensure the result is within our target value range.
		targetValue = this._targetValueRange.fix(targetValue);

		this._registers.write(targetReg, targetValue);

		return OperationState.NEXT;
	}
}
