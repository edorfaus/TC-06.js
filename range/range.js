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
