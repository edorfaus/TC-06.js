/**
 * This class represents a range of (integer) values, inclusive in both ends.
 *
 * This is intended as an abstract base class (and interface) for various
 * implementations to subclass, so should not be directly instantiated.
 */
class Range {
	constructor(min, max) {
		if (min > max) {
			throw new Error('Invalid range: min > max');
		}
		this._min = min;
		this._max = max;
	}

	/**
	 * The minimum value in this range.
	 */
	get min() {
		return this._min;
	}

	/**
	 * The maximum value in this range.
	 */
	get max() {
		return this._max;
	}

	/**
	 * The size of this range: the number of values that are included in it.
	 *
	 * This is never below 1 since even (min == max) includes that one value.
	 */
	get size() {
		return this._max - this._min + 1;
	}

	/**
	 * Get the number of bits that are required to distinguish between all the
	 * values of this range.
	 *
	 * Note that this always returns a positive integer, even if the range only
	 * includes a single value (which technically doesn't require any storage).
	 *
	 * Also note that this does not mean that all the values in the range can
	 * be represented as a simple twos-complement representation of that value
	 * using just this number of bits. It can sometimes, but not always.
	 *
	 * (E.g. 0-255 fits in 8 bits, but the same is true for 1-256 and 5-260.)
	 */
	get sizeBits() {
		return Math.max(1, Math.ceil(Math.log2(this.size)));
	}

	/**
	 * Get the number of bits that are required to hold all the values of this
	 * range using a standard two's-complement representation.
	 */
	get bitsTwosComplement() {
		// log2(2^N) gives N. However, for N bits, two's-complement only allows
		// from 0 to 2^N - 1 to be represented, 2^N itself requires N+1 bits.
		// log2(V) for 2^N < V < 2^(N+1) gives a result between N and N+1.
		// Doing a ceil() on that result would give N+1 for 2^N < V <= 2^(N+1)
		// but that's not quite what we want - we're after 2^N <= V < 2^(N+1)
		// Doing a floor() on that result would give N for 2^N <= V < 2^(N+1)
		// which is almost there, we just need to add 1 to get N+1.

		// So, for unsigned numbers, floor(log2(max)) + 1 should work.

		// For signed numbers, with N+1 bits (one extra for the sign), two's
		// complement again allows up to 2^N - 1, but down all the way to -2^N.
		// So for max>0 the above calculation still works for that half of it,
		// except we need to add another bit to enable the negatives.
		// For the negatives, we actually need N+1 bits for 2^N < -V <= 2^(N+1)
		// which is what we get from doing a ceil() on the result of log2(-V),
		// though again we need to add another bit for the sign bit itself.

		// So, for negative numbers, ceil(log2(-min)) should work, as long as
		// we remember to add one to the final result.

		let bits = this._max > 0 ? Math.floor(Math.log2(this._max)) + 1 : 1;
		if (this._min < 0) {
			return Math.max(bits, Math.ceil(Math.log2(-this._min))) + 1;
		}
		return bits;
	}

	/**
	 * Check if the given value is included within this range.
	 */
	includes(value) {
		return value >= this._min && value <= this._max;
	}

	/**
	 * Check if the given value is _not_ included within this range.
	 */
	excludes(value) {
		return value < this._min || value > this._max;
	}

	/**
	 * Try to fix the given value so that it is within this range.
	 *
	 * Depending on the specific subclass implementation, this may be done in
	 * various ways, including throwing an error, but if it returns, the
	 * returned value must be within the range.
	 */
	fix(value) {
		// This function is abstract, meant to be implemented by subclasses.
		throw new Error('fix() is not implemented by ' + this.constructor.name);
	}
}
