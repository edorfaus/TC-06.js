class TC_06_ControlUnit {
	constructor(operations, programCounter) {
		this._operations = operations;
		this._programCounter = programCounter;
		this._lastOperation = null;
	}
	/**
	 * Run a new instruction.
	 */
	run(instruction) {
		let opcode = (instruction & 0xF0000000) >>> 28;
		let operation = this._operations[opcode];
		if (!operation) {

			throw new Error('Invalid opcode');
		}

		let state = operation.run(instruction);

		if (state === OperationState.NEXT) {

			let value = this._programCounter.read(0);
			value++;
			this._programCounter.write(0, value);

		} else if (state === OperationState.AGAIN) {

			this._lastOperation = operation;
		}

		return state;
	}
	/**
	 * Resume the operation that needed to be run again.
	 */
	resume() {
		let state = this._lastOperation.resume();

		if (state === OperationState.AGAIN) {
			return state;
		}

		this._lastOperation = null;

		if (state === OperationState.NEXT) {

			let value = this._programCounter.read(0);
			value++;
			this._programCounter.write(0, value);
		}

		return state;
	}
	/**
	 * Cancel the operation that needed to be run again.
	 *
	 * This implies that the program counter has been modified and we will be
	 * getting a new instruction in a call to run().
	 *
	 * This method must not modify the program counter.
	 */
	cancel() {
		this._lastOperation.cancel();
		this._lastOperation = null;
	}
}
