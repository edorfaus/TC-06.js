Operations.TC_06 = (memory, registers, programCounter, deviceBus) => {

	// The targetValueRange must always be wrapping for the operations to work,
	// as otherwise operations that change the high bit could fail spuriously.
	let valueRange = registers.valueRange;
	let targetValueRange = new WrappingRange(valueRange.min, valueRange.max);

	let O = Operations.TC_06;

	let operations = [];

	operations[0x0] = new O.Nil();
	operations[0x1] = new O.Hlt();
	operations[0x2] = new O.MovI(memory, registers);
	operations[0x3] = new O.MovO(memory, registers);
	operations[0x4] = new O.Jmp(memory, programCounter, true);
	operations[0x5] = new O.SetData(deviceBus, memory, registers, programCounter);
	operations[0x6] = new O.GetData(deviceBus, memory, registers, programCounter, 0x1);
	operations[0x7] = new O.Set(registers, targetValueRange);
	operations[0x8] = new O.IfJmp(memory, registers, programCounter, 0x2, 0x3, false);
	operations[0x9] = new O.Pmov(registers, targetValueRange);
	operations[0xA] = new O.Math(registers, targetValueRange);

	return operations;
};
