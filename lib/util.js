const Util = {
	/**
	 * Ensure that the given value is instance of the
	 * expected type.
	 * @param {*} actual Value to check instance of.
	 * @param {Type} expected Expected type.
	 * @param {string} [message] Error message.
	 */
	ensureInstance(actual, expected, message) {
		if (!(actual instanceof expected)) {
			if (!message) {
				message = `${actual} is not instance of ${expected.name}`;
			}
			throw new TypeError(message);
		}
	}
};
module.exports = Util;
