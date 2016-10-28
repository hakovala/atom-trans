"use strict";

const assert = require('assert');

function AssertExtra(target) {
	if (!(this instanceof AssertExtra))
		return new AssertExtra(target);

	this.target = target;
}
module.exports = AssertExtra;

function isUndefinedOrNull(target) {
	return (target === null || typeof target === 'undefined');
}

AssertExtra.prototype.fail = function(expected, msg, op) {
	assert.fail(this.target, expected, msg, op);
	return this;
};

AssertExtra.prototype.ok = function(msg) {
	assert.ok(this.target, msg);
	return this;
};

AssertExtra.prototype.notOk = function(msg) {
	if (!!this.target) {
		this.fail(true, msg, '!=');
	}
	return this;
};

AssertExtra.prototype.equal = function(expected, msg) {
	assert.equal(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.strictEqual = function(expected, msg) {
	assert.strictEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.notEqual = function(expected, msg) {
	assert.notEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.notStrictEqual = function(expected, msg) {
	assert.notStrictEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.deepEqual = function(expected, msg) {
	assert.deepEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.deepStrictEqual = function(expected, msg) {
	assert.deepStrictEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.notDeepEqual = function(expected, msg) {
	assert.notDeepEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.notDeepStrictEqual = function(expected, msg) {
	assert.notDeepStrictEqual(this.target, expected, msg);
	return this;
};

AssertExtra.prototype.throws = function(error, msg) {
	assert.throws(this.target, error, msg);
	return this;
};

AssertExtra.prototype.doesNotThrow = function(error, msg) {
	assert.doesNotThrow(this.target, error, msg);
	return this;
};

//
// Additional assertions
//

AssertExtra.prototype.isTypeOf =
AssertExtra.prototype.typeOf =function(expected, msg) {
	assert.strictEqual(typeof this.target, expected, msg);
	return this;
};

AssertExtra.prototype.isNotTypeOf =
AssertExtra.prototype.notTypeOf = function(expected, msg) {
	assert.notStrictEqual(typeof this.target, expected, msg);
	return this;
};

AssertExtra.prototype.isInstanceOf =
AssertExtra.prototype.instanceOf = function(expected, msg) {
	if (!(this.target instanceof expected)) {
		this.fail(expected, msg, 'instanceof');
	}
	return this;
};

AssertExtra.prototype.isNotInstanceOf =
AssertExtra.prototype.notInstanceOf = function(expected, msg) {
	if (this.target instanceof expected) {
		this.fail(expected, msg, '!instanceof');
	}
	return this;
};

AssertExtra.prototype.isBoolean = function(msg) {
	return this.isTypeOf('boolean', msg);
};

AssertExtra.prototype.isNotBoolean =
AssertExtra.prototype.notBoolean = function(msg) {
	return this.isNotTypeOf('boolean', msg);
};

AssertExtra.prototype.isTrue = function(msg) {
	return this.strictEqual(true, msg);
};

AssertExtra.prototype.isNotTrue =
AssertExtra.prototype.notTrue = function(msg) {
	return this.notStrictEqual(true, msg);
};

AssertExtra.prototype.isFalse = function(msg) {
	return this.strictEqual(false, msg);
};

AssertExtra.prototype.isNotFalse =
AssertExtra.prototype.notFalse = function(msg) {
	return this.notStrictEqual(false, msg);
};

AssertExtra.prototype.isNull = function(msg) {
	return this.strictEqual(null, msg);
};

AssertExtra.prototype.isNotNull =
AssertExtra.prototype.notNull = function(msg) {
	return this.notStrictEqual(null, msg);
};

AssertExtra.prototype.isUndefined = function(msg) {
	return this.isTypeOf('undefined', msg);
};

AssertExtra.prototype.isNotUndefined =
AssertExtra.prototype.notUndefined =
AssertExtra.prototype.isDefined = function(msg) {
	return this.isNotTypeOf('undefined', msg);
};

AssertExtra.prototype.isNumber = function(msg) {
	return this.isTypeOf('number', msg);
};

AssertExtra.prototype.isNotNumber =
AssertExtra.prototype.notNumber = function(msg) {
	return this.isNotTypeOf('number', msg);
};

AssertExtra.prototype.isString = function(msg) {
	return this.isTypeOf('string', msg);
};

AssertExtra.prototype.isNotString =
AssertExtra.prototype.notString = function(msg) {
	return this.isNotTypeOf('string', msg);
};

AssertExtra.prototype.isFunction = function(msg) {
	return this.isTypeOf('function', msg);
};

AssertExtra.prototype.isNotFunction =
AssertExtra.prototype.notFunction = function(msg) {
	return this.isNotTypeOf('function', msg);
};

AssertExtra.prototype.isObject = function(msg) {
	return this.isTypeOf('object', msg);
};

AssertExtra.prototype.isNotObject =
AssertExtra.prototype.notObject = function(msg) {
	return this.isTypeOf('object', msg);
};

AssertExtra.prototype.isArray = function(msg) {
	if (!Array.isArray(this.target)) {
		assert.fail(typeof this.target, 'array', msg, '===');
	}
	return this;
};

AssertExtra.prototype.isNotArray =
AssertExtra.prototype.notArray = function(msg) {
	if (Array.isArray(this.target)) {
		assert.fail(typeof this.target, 'array', msg, '!==');
	}
	return this;
};

AssertExtra.prototype.match = function(expected, msg) {
	if (!expected.test(this.target)) {
		this.fail(expected, msg, 'match');
	}
	return this;
};

AssertExtra.prototype.notMatch = function(expected, msg) {
	if (expected.test(this.target)) {
		this.fail(expected, msg, '!match');
	}
	return this;
};

AssertExtra.prototype.includes = function(expected, msg) {
	if (!this.target.includes(expected)) {
		this.fail(expected, msg, 'include')
	}
	return this;
};

AssertExtra.prototype.doesNotIncludes
AssertExtra.prototype.notIncludes = function(expected, msg) {
	if (this.target.includes(expected)) {
		this.fail(expected, msg, '!include');
	}
	return this;
};

AssertExtra.prototype.hasLength = function(expected, msg) {
	if (isUndefinedOrNull(this.target)) {
		return this.fail(expected, msg, 'length');
	}
	if (this.target.length !== expected) {
		this.fail(expected, msg, 'length');
	}
	return this;
};

AssertExtra.prototype.hasNotLength =
AssertExtra.prototype.notLength = function(expected, msg) {
	if (isUndefinedOrNull(this.target)) {
		return this.fail(expected, msg, 'length');
	}
	if (this.target.length === expected) {
		this.fail(expected, msg, 'length');
	}
	return this;
};

AssertExtra.prototype.lessThan = function(expected, msg) {
	if (this.target >= expected) {
		this.fail(expected, msg, '<');
	}
	return this;
};

AssertExtra.prototype.lessOrEqual = function(expected, msg) {
	if (this.target > expected) {
		this.fail(expected, msg, '<=');
	}
	return this;

};

AssertExtra.prototype.greaterThan = function(expected, msg) {
	if (this.target <= expected) {
		this.fail(expected, msg, '>');
	}
	return this;

};

AssertExtra.prototype.greaterOrEqual = function(expected, msg) {
	if (this.target < expected) {
		this.fail(expected, msg, '>=');
	}
	return this;
};
