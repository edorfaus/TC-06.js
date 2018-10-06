/**
 * This type of range throws an Error if the value was out of range.
 */
class ThrowingRange extends Range {
	constructor(min, max, errorMessage = 'Value was out of range') {
		super(min, max);
		this._errorMessage = errorMessage;
	}
	fix(value) {
		if (value < this._min || value > this._max) {
			throw new Error(this._errorMessage);
		}
		return value;
	}
}
