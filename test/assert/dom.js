"use strict";

const assert = require('./extras');

module.exports = function(target) {
	return new AssertDom(target);
};

class AssertDom extends assert.Assert {

	constructor(target) {
		super(target);
	}

	hasAttr(attr, value) {
		const el = this.target;
		let actual = this.target.getAttribute(attr);

		if (value === undefined) {
			assert(!!el.attributes[attr]).ok(`expected ${elementToString(el)} to have an attribute '${attr}'`);
		} else {
			assert(value === actual).ok(`expected ${elementToString(el)} to have an attribute '${attr}' with value '${value}', but value was '${actual}'`);
		}
	}

	hasClass(expected) {
		assert(this.target.classList.contains(expected)).ok(
			`expected ${elementToString(this.target)} to have class '${expected}'`);
	}

	hasId(expected) {
		assert(this.target.id == expected).ok(
			`expected ${elementToString(this.target)} to have id '${expected}', but was '${this.target.id}'`);
	}

	hasHTML(expected) {
		let actual = this.target.innerHTML;
		assert(actual == expected).ok(
			`expected ${elementToString(this.target)} to have HTML '${expected}', but was '${actual}'`);
	}

	hasText(expected) {
		let actual = this.target.innerText;
		assert(actual).equal(expected,
			`expected ${elementToString(this.target)} to have HTMl '${expected}', but was '${actual}'`);
		return this;
	}

	isEmpty() {
		return this.hasLength(0);
	}

	hasChildCount(expected) {
		let el = this.target;
		let actual;

		if (el instanceof HTMLElement) {
			actual = el.children.length;
		} else if (el instanceof NodeList) {
			actual = el.length;
		} else {
			return assert.fail('not an HTMLElement or NodeList');
		}

		assert(actual === expected)
			.ok(`expected ${elementToString(el)} to be empty, but has ${actual} children`);
	}

	matches(expected) {
		let el = this.target;

		if (el instanceof HTMLElement) {
			assert(el.matches(expected)).ok(`expected ${elementToString(el)} to match '${expected}'`);
		}
	}
}

function elementToString(el) {
	let desc;

	if (el instanceof NodeList) {
		if (el.length === 0) {
			return 'empty NodeList';
		}
		desc = Array.prototype.call(el, 0, 5)
			.map(elementToString).join(', ');
		return el.length > 5 ? `${desc}... (${el.length - 5} more)` : desc;
	}

	if (!(el instanceof HTMLElement)) {
		return String(el);
	}

	desc = el.tagName.toLowerCase();
	if (el.id) {
		desc += '#' + el.id;
	}
	if (el.className) {
		desc += '.' + String(el.className).replace('\s+', '.');
	}
	Array.from(el.attributes).forEach((attr) => {
		if (attr.name !== 'class' && attr.name !== 'id') {
			desc += `[${attr.name + (attr.value ? '="' + attr.value + '"' : '')}]`;
		}
	});
	return desc;
}
