class OperationState {
	/**
	 * The cycle is complete, continue next cycle with the next instruction.
	 *
	 * This implies that the program counter should be incremented by the
	 * control unit, so the operation doesn't have to do it itself.
	 */
	static get NEXT() {
		return 0;
	}
	/**
	 * The cycle is complete, continue next cycle with the current instruction.
	 *
	 * This implies that the program counter has been set by the operation.
	 */
	static get DONE() {
		return 1;
	}
	/**
	 * The cycle is complete, continue next cycle by resuming this operation.
	 *
	 * This implies that the program counter was left on the current operation
	 * on purpose, because this operation needs another cycle to do its job.
	 */
	static get AGAIN() {
		return 2;
	}
	/**
	 * The cycle is not yet complete, continue by running the instruction the
	 * program counter points to.
	 *
	 * This implies that the program counter has been set by the operation.
	 *
	 * Not all instruction units necessarily support this state, as it's not
	 * realistic in terms of real hardware.
	 */
	static get RUN() {
		return 3;
	}
}
