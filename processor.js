class Processor
{
	constructor(memoryBus, deviceBus, instructions) {
		this.memoryBus = memoryBus;
		this.deviceBus = deviceBus;
		this.registers = new RAM(4, 32);
		this._instructions = instructions;
		this._currentIP = 0;
		this._loopProtection = new Set();
		this.instructionState = null;
	}
	get currentIP() {
		return this._currentIP;
	}
	set currentIP(newIP) {
		this._currentIP = newIP;
		this.instructionState = null;
	}
	tick() {
		this._loopProtection.clear();
		let state = Processor.RUN_NOW;
		while (state === Processor.RUN_NOW) {
			state = this.runInstruction();
			if (state !== Processor.RUN_AGAIN) {
				this.instructionState = null;
			}
		}
		if (state !== Processor.RUN_AGAIN && state !== Processor.RUN_ERROR) {
			this._currentIP++;
		}
		this._loopProtection.clear();
	}
	runInstruction() {
		if (this._loopProtection.has(this._currentIP)) {
			// This instruction was already run during this tick, so we
			// are jumping in a loop. Break the loop to ensure it ends.
			return Processor.RUN_ERROR;
		}
		this._loopProtection.add(this._currentIP);

		let instruction = this.memoryBus.read(this._currentIP);
		if (typeof instruction === 'undefined') {
			// Instruction pointer is out of range
			return Processor.RUN_ERROR;
		}
		let opcode = (instruction & 0xF0000000) >>> 28;
		let operation = this._instructions[opcode];
		if (!operation) {
			// Invalid opcode
			return Processor.RUN_ERROR;
		}
		return operation.run(this, instruction);
	}
}
Processor.RUN_DONE = 0; // Provided for completeness only, this is the default.
Processor.RUN_AGAIN = 1; // Return if the same instruction should run again.
Processor.RUN_NOW = 2; // Return if the next instruction should be run now.
Processor.RUN_ERROR = 3; // Returned if an error occurred. Reruns instruction.
