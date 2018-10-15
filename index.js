let uiManager = new UIManager();

let clock = new Clock(uiManager);
let memoryBus = new MemoryBus(24, 32);
let deviceBus = new DeviceBus(4, 32);

memoryBus.attachDevice(0, 32, new RAM(5, 32));

let screen = new Screen(2, 4, 3, 32, new RAM(4 + 3, 32));
deviceBus.attachDevice(0, 1, screen);
deviceBus.attachDevice(1, 1, new Drive(new RAM(8, 32)));

let screenRenderer = new TableScreenRenderer(document.getElementById('screen-table'));
screenRenderer.link(screen);
uiManager.add(screenRenderer);

let valueRange = new ThrowingRange(
	0, Math.pow(2, 32) - 1, 'Data value out of range'
);

let registers = new RAM(4, 32);
let programCounter = new SingleWordMemory(valueRange);

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

let mainMemoryRenderer = new MainMemoryRenderer(
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
