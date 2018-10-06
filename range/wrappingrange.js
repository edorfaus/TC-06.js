/**
 * This type of range wraps out-of-range values around to the other end.
 */
class WrappingRange extends Range {
	fix(value) {
		if (value < this._min || value > this._max) {
			let min = this._min;
			let divisor = this.size;
			// The divisor is the number of values inside the wanted range.
			// Subtracting the minimum aligns the value with the divisor, so
			// that the minimum value ends up at 0. The first division then
			// gives a remainder within plus-or-minus the divisor. Adding the
			// divisor moves that into the range 0 to double the divisor. The
			// second division then gives a remainder in the range 0 to the
			// divisor. Adding the minimum back in then undoes the alignment,
			// moving the result into the wanted range.
			return ((value - min) % divisor + divisor) % divisor + min;
		}
		return value;
	}
}
