class TC_06_InstructionUnit {
	constructor(controlUnit, memory, programCounter) {
		this._controlUnit = controlUnit;
		this._memory = memory;
		this._programCounter = programCounter;
		this._loopProtection = new Set();
		this._runAgain = null;
	}
	/**
	 * Run a new cycle, either by resuming an existing operation or by running
	 * a new instruction based on the current value of the program counter.
	 */
	runCycle() {
		let state = OperationState.RUN;
		let programCounter;

		if (this._runAgain !== null) {

			programCounter = this._programCounter.read(0);;
			if (this._runAgain !== programCounter) {

				this._controlUnit.cancel();

			} else {

				state = this._controlUnit.resume();

				if (state === OperationState.AGAIN) {

					return;
				}
			}
			this._runAgain = null;
		}

		if (state === OperationState.RUN) {

			let loopProtection = this._loopProtection;
			loopProtection.clear();

			while (state === OperationState.RUN) {

				programCounter = this._programCounter.read(0);

				if (loopProtection.has(programCounter)) {

					// This address was already run during this cycle, so we
					// are jumping in a loop. Break the loop to ensure it ends.
					throw new Error('RUN loop detected');
				}
				loopProtection.add(programCounter);

				let instruction = this._memory.read(programCounter);

				state = this._controlUnit.run(instruction);
			}

			loopProtection.clear();
		}

		if (state === OperationState.AGAIN) {

			this._runAgain = programCounter;
		}
	}
}
