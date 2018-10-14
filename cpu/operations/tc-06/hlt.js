// 0001 HLT <28b: ticks>
Operations.TC_06.Hlt = class Hlt {
	constructor() {
		this._remainingCycles = 0;
	}
	run(instruction) {
		let haltCycles = instruction & 0x0FFFFFFF;
		if (haltCycles === 1) {

			// Halting for one cycle is essentially just a no-op.
			return OperationState.NEXT;
		}

		// Subtract one for the current cycle.
		// This makes it negative for HLT 0, which we use in resume().
		this._remainingCycles = haltCycles - 1;

		return OperationState.AGAIN;
	}
	resume() {
		if (this._remainingCycles > 0) {

			this._remainingCycles--;
			return OperationState.AGAIN;
		}

		if (this._remainingCycles === 0) {

			return OperationState.NEXT;
		}

		// There's a negative number of cycles left, which means we started
		// with 0, which means we should be halted forever.

		return OperationState.AGAIN;
	}
	cancel() {
		this._remainingCycles = 0;
	}
}
