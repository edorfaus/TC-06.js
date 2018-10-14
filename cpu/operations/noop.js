Operations.NoOp = class NoOp {
	run(instruction) {
		// No operation: the instruction is ignored.
		return OperationState.NEXT;
	}
}
