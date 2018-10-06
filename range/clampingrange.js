/**
 * This type of range clamps out-of-range values to the min/max value.
 */
class ClampingRange extends Range {
	fix(value) {
		if (value > this._max) {
			return this._max;
		}
		if (value < this._min) {
			return this._min;
		}
		return value;
	}
}
