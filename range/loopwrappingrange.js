/**
 * This type of range wraps out-of-range values around to the other end, just
 * like WrappingRange does, but does it using loops instead of divisions.
 *
 * If you know that your values are always close to the proper range, this
 * version might be faster, but if the value is further away then this version
 * is slow - potentially very slow (it grows with how far away the value was).
 */
class LoopWrappingRange extends Range {
	fix(value) {
		while (value > this._max) {
			value -= this.size;
		}
		while (value < this._min) {
			value += this.size;
		}
		return value;
	}
}
