// 0100 JMP <2b: flag> <24b: address> <2b: ignored>
class JmpInstruction
{
	run(processor, instruction) {
		let flag = (instruction >>> 26) & 0x00000003;
		let address = (instruction >>> 2) & 0x00FFFFFF;
		let newIP;
		switch (flag) {
			case 0: newIP = processor.currentIP + address; break;
			case 1: newIP = address; break;
			case 2: newIP = processor.currentIP - address; break;
			case 3: newIP = processor.memoryBus.maxAssignedAddress - address; break;
			default: throw new Error('Invalid JMP flag: ' + flag);
		}
		processor.currentIP = newIP;
		return Processor.RUN_NOW;
	}
}
