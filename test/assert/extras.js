"use strict";

const assert = require('assert');

module.exports = function(target) {
	return new AssertExtra(target);
};

class AssertExtra {

	constructor(target) {
		this.target = target;
	}

	static isUndefinedOrNull(target) {
		return (target === null || typeof target === 'undefined');
	}
	isUndefinedOrNull() { return AssertExtra.isUndefinedOrNull(this.target); }


	fail(expected, msg, op) {
		assert.fail(this.target, expected, msg, op);
		return this;
	}

	ok(msg) {
		assert.ok(this.target, msg);
		return this;
	}

	notOk(msg) {
		if (!!this.target) {
			this.fail(true, msg, '!=');
		}
		return this;
	}

	equal(expected, msg) {
		assert.equal(this.target, expected, msg);
		return this;
	}

	strictEqual(expected, msg) {
		assert.strictEqual(this.target, expected, msg);
		return this;
	}

	notEqual(expected, msg) {
		assert.notEqual(this.target, expected, msg);
		return this;
	}

	notStrictEqual(expected, msg) {
		assert.notStrictEqual(this.target, expected, msg);
		return this;
	}

	deepEqual(expected, msg) {
		assert.deepEqual(this.target, expected, msg);
		return this;
	}

	deepStrictEqual(expected, msg) {
		assert.deepStrictEqual(this.target, expected, msg);
		return this;
	}

	notDeepEqual(expected, msg) {
		assert.notDeepEqual(this.target, expected, msg);
		return this;
	}

	notDeepStrictEqual(expected, msg) {
		assert.notDeepStrictEqual(this.target, expected, msg);
		return this;
	}

	throws(error, msg) {
		assert.throws(this.target, error, msg);
		return this;
	}

	doesNotThrow(error, msg) {
		assert.doesNotThrow(this.target, error, msg);
		return this;
	}

	//
	// Additional assertions
	//

	isTypeOf(expected, msg) { return this.typeOf(expected, msg); }
	typeOf(expected, msg) {
		assert.strictEqual(typeof this.target, expected, msg);
		return this;
	}

	isNotTypeOf(expected, msg) { return this.notTypeOf(expected, msg); }
	notTypeOf(expected, msg) {
		assert.notStrictEqual(typeof this.target, expected, msg);
		return this;
	}

	instanceOf(expected, msg) {
		if (!(this.target instanceof expected)) {
			this.fail(expected, msg, 'instanceof');
		}
		return this;
	}

	notInstanceOf(expected, msg) {
		if (this.target instanceof expected) {
			this.fail(expected, msg, '!instanceof');
		}
		return this;
	}

	isBoolean(msg) {
		return this.isTypeOf('boolean', msg);
	}

	notBoolean(msg) {
		return this.isNotTypeOf('boolean', msg);
	}

	isTrue(msg) {
		return this.strictEqual(true, msg);
	}

	notTrue(msg) {
		return this.notStrictEqual(true, msg);
	}

	isFalse(msg) {
		return this.strictEqual(false, msg);
	}

	notFalse(msg) {
		return this.notStrictEqual(false, msg);
	}

	isNull(msg) {
		return this.strictEqual(null, msg);
	}

	notNull(msg) {
		return this.notStrictEqual(null, msg);
	}

	isUndefined(msg) {
		return this.isTypeOf('undefined', msg);
	}

	notUndefined(msg) {
		return this.isDefined(msg);
	}
	isDefined(msg) {
		return this.isNotTypeOf('undefined', msg);
	}

	isNumber(msg) {
		return this.isTypeOf('number', msg);
	}

	notNumber(msg) {
		return this.isNotTypeOf('number', msg);
	}

	isString(msg) {
		return this.isTypeOf('string', msg);
	}

	notString(msg) {
		return this.isNotTypeOf('string', msg);
	}

	isFunction(msg) {
		return this.isTypeOf('function', msg);
	}

	notFunction(msg) {
		return this.isNotTypeOf('function', msg);
	}

	isObject(msg) {
		return this.isTypeOf('object', msg);
	}

	notObject(msg) {
		return this.isTypeOf('object', msg);
	}

	isArray(msg) {
		if (!Array.isArray(this.target)) {
			assert.fail(typeof this.target, 'array', msg, '===');
		}
		return this;
	}

	notArray(msg) {
		if (Array.isArray(this.target)) {
			assert.fail(typeof this.target, 'array', msg, '!==');
		}
		return this;
	}

	match(expected, msg) {
		if (!expected.test(this.target)) {
			this.fail(expected, msg, 'match');
		}
		return this;
	}

	notMatch(expected, msg) {
		if (expected.test(this.target)) {
			this.fail(expected, msg, '!match');
		}
		return this;
	}

	includes(expected, msg) {
		if (!this.target.includes(expected)) {
			this.fail(expected, msg, 'include');
		}
		return this;
	}

	notIncludes(expected, msg) {
		if (this.target.includes(expected)) {
			this.fail(expected, msg, '!include');
		}
		return this;
	}

	hasLength(expected, msg) {
		if (this.isUndefinedOrNull()) {
			return this.fail(expected, msg, 'length');
		}
		if (this.target.length !== expected) {
			this.fail(expected, msg, 'length');
		}
		return this;
	}

	notLength(expected, msg) {
		if (this.isUndefinedOrNull()) {
			return this.fail(expected, msg, 'length');
		}
		if (this.target.length === expected) {
			this.fail(expected, msg, 'length');
		}
		return this;
	}

	lessThan(expected, msg) {
		if (this.target >= expected) {
			this.fail(expected, msg, '<');
		}
		return this;
	}

	lessOrEqual(expected, msg) {
		if (this.target > expected) {
			this.fail(expected, msg, '<=');
		}
		return this;

	}

	greaterThan(expected, msg) {
		if (this.target <= expected) {
			this.fail(expected, msg, '>');
		}
		return this;

	}

	greaterOrEqual(expected, msg) {
		if (this.target < expected) {
			this.fail(expected, msg, '>=');
		}
		return this;
	}
}
