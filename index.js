let clock = new Clock();
let memoryBus = new MemoryBus(24, 32);
let deviceBus = new DeviceBus(4, 32);

memoryBus.attachDevice(0, 32, new RAM(5, 32));

let screen = new Screen(2, 4, 3);
deviceBus.attachDevice(0, 1, screen);
deviceBus.attachDevice(1, 1, new Drive(new RAM(8, 32)));

new TableScreenRenderer(document.getElementById('screen-table')).link(screen);

let instructions = [];
instructions[0x0] = new NilInstruction();
instructions[0x1] = new HltInstruction();
instructions[0x2] = new MoviInstruction();
instructions[0x3] = new MovoInstruction();
instructions[0x4] = new JmpInstruction();
instructions[0x5] = new SetdataInstruction();
instructions[0x6] = new GetdataInstruction(0x1);
instructions[0x7] = new SetInstruction();
instructions[0x8] = new IfjmpInstruction(0x2, 0x3);
instructions[0x9] = new PmovInstruction();
instructions[0xA] = new MathInstruction();

let processor = new Processor(memoryBus, deviceBus, instructions);

clock.on('tick', () => processor.tick());

new SystemControls(document.getElementById('system-controls')).link(clock);

let mainMemoryRenderer = new MainMemoryRenderer(document.getElementById('main-memory'));
mainMemoryRenderer.link(memoryBus);

clock.on('render-tick', () => mainMemoryRenderer.renderTick());

let registersRenderer = new MemoryRenderer(document.getElementById('registers'));
registersRenderer.link(processor.registers);

clock.on('render-tick', () => registersRenderer.renderTick());

[
	0x50100000,
	0x50210000,
	0x50320000,

	0x50122000,
	0x50212000,
	0x50302000,

	0x501EC000,

	0x501FE000,

	0x10000004,
	0x501F0000,
	0x10000004,
	0x502F0000,
	0x48000010,

	0x10000000
].forEach((item, index) => memoryBus.write(index, item));
