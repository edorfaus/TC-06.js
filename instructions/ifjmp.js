// 1000 IFJMP <2b: flag> <24b: address> <2b: operation>
class IfjmpInstruction
{
	constructor(register1, register2) {
		this._register1 = register1;
		this._register2 = register2;
	}
	run(processor, instruction) {
		let value1 = processor.registers.read(this._register1);
		let value2 = processor.registers.read(this._register2);
		let operation = instruction & 0x00000003;
		let result;
		switch (operation) {
			case 0: result = (value1 == value2); break;
			case 1: result = (value1 != value2); break;
			case 2: result = (value1 > value2); break;
			case 3: result = (value1 < value2); break;
			default: throw new Error('Invalid IFJMP operation: ' + operation);
		}
		if (!result) {
			return Processor.RUN_DONE;
		}
		let flag = (instruction >>> 26) & 0x00000003;
		let address = (instruction >>> 2) & 0x00FFFFFF;
		let newIP;
		switch (flag) {
			case 0: newIP = processor.currentIP + address; break;
			case 1: newIP = address; break;
			case 2: newIP = processor.currentIP - address; break;
			case 3: newIP = processor.memoryBus.maxAddress - address; break;
			default: throw new Error('Invalid JMP flag: ' + flag);
		}
		processor.currentIP = newIP;
		return Processor.RUN_AGAIN;
	}
}
