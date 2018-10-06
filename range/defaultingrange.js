/**
 * This type of range returns a default value if the value was out of range.
 */
class DefaultingRange extends Range {
	constructor(min, max, defaultValue) {
		super(min, max);
		if (this.excludes(defaultValue)) {
			throw new Error('The default value must be included in the range');
		}
		this._defaultValue = defaultValue;
	}
	fix(value) {
		if (value < this._min || value > this._max) {
			return this._defaultValue;
		}
		return value;
	}
}
