let valueRange = new ThrowingRange(
	0, Math.pow(2, 32) - 1, 'Data value out of range'
);

let uiManager = new UIManager();

let clock = new Clock(uiManager);
let memoryBus = new DelegatingMemory([ArrayMemory.forBits(5, valueRange)]);

let screen = new Screen(2, 4, 3, 32, ArrayMemory.forBits(4 + 3, valueRange));

let deviceBus = new ArrayDeviceBus([
	screen,
	new Drive(ArrayMemory.forBits(8, valueRange))
]);

let screenRenderer = new TableScreenRenderer(document.getElementById('screen-table'));
screenRenderer.link(screen);
uiManager.add(screenRenderer);

let registers = ArrayMemory.forBits(4, valueRange);
let programCounter = new SingleWordMemory(memoryBus.addressRange);

let operations = Operations.TC_06(memoryBus, registers, programCounter, deviceBus);
let controlUnit = new TC_06_ControlUnit(operations, programCounter);
let cpuCore = new TC_06_InstructionUnit(controlUnit, memoryBus, programCounter);

clock.on('tick', () => {
	try {
		cpuCore.runCycle()
	} catch (e) {
		console.error('CPU cycle failed', e);
		clock.running = false;
	}
});

new SystemControls(document.getElementById('system-controls')).link(clock);

let mainMemoryRenderer = new MemoryRenderer(
	document.getElementById('main-memory'), uiManager
);
mainMemoryRenderer.link(memoryBus);
uiManager.add(mainMemoryRenderer);

let registersRenderer = new MemoryRenderer(
	document.getElementById('registers'), uiManager
);
registersRenderer.link(registers);
uiManager.add(registersRenderer);

[
	0x50100000,
	0x50210000,
	0x50320000,

	0x50122000,
	0x50212000,
	0x50302000,

	0x501EC000,

	0x501FE000,

	0x70200000,

	0x10000004,
	0x501F0000,
	0x10000004,
	0x502F0000,
	0x48000010,

	0x10000000
].forEach((item, index) => memoryBus.write(index, item));
uiManager.triggerRefresh();
