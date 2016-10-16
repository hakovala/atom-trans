"use strict";

// assing Node Assert object to empty one
const assert = module.exports = require('assert');

function elToString(el) {
	let desc;

	if (el instanceof NodeList) {
		if (el.length === 0) return 'empty NodeList';
		desc = Array.prototype.slice.call(el, 0, 5)
			.map(elToString).join(', ');
		return el.length > 5 ? desc + '... (+' + (el.length - 5) + ' more)' : desc;
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
	Array.prototype.forEach.call(el.attributes, (attr) => {
		if (attr.name !== 'class' && attr.name !== 'id') {
			desc += '[' + attr.name + (attr.value ? '="' + attr.value + '"]' : ']');
		}
	});
	return desc;
}

assert.hasAttr = function(el, attr, value) {
	let actual = el.getAttribute(attr);

	if (value === undefined) {
		assert(
			!!el.attributes[attr],
			`expected ${elToString(el)} to have an attribute '${attr}'`
		);
	} else {
		assert(
			value === actual,
			`expected ${elToString(el)} to have an attribute '${attr} with value '${value}, but value was '${actual}'`
		);
	}
};

assert.hasClass = function(el, exp) {
	assert(
		el.classList.contains(exp),
		`expected ${elToString(el)} to have class '${exp}'`
	);
};

assert.hasId = function(el, exp) {
	assert(
		el.id == exp,
		`expected ${elToString(el)} to have id '${exp}'`
	);
};

assert.hasHTML = function(el, exp) {
	let actual = el.innerHTML;
	assert(
		actual == exp,
		`expected ${elToString(el)} to have HTML '${exp}', but HTML was '${actual}'`
	);
};

assert.hasText = function(el, exp) {
	let actual = el.innerText;
	assert(
		actual == exp,
		`expected ${elToString(el)} to have text '${exp}', but text was '${actual}'`
	);	
};

assert.isEmpty = function(el) {
	if (el instanceof HTMLElement) {
		assert(
			el.children.length === 0,
			`expected ${elToString(el)} to be empty`
		);
	} else if (el instanceof NodeList) {
		assert(
			el.length === 0,
			`expected ${elToString(el)} to be empty`
		);
	}
};

assert.hasLength = function(el, exp) {
	if (el instanceof HTMLElement) {
		let actual = el.children.length;
		assert(
			actual === exp,
			`expected ${elToString(el)} to have ${exp} children but it had ${actual}`
		);
	} else if (el instanceof NodeList) {
		let actual = el.length;
		assert(
			actual === 0,
			`expected ${elToString(el)} to have ${exp} children but it had ${actual}`
		);
	}
};

assert.matches = function(el, exp) {
	if (el instanceof NodeList) {
		assert(
			(!!el.length && Array.prototype.every.call(el, (e) => e.matches(exp))),
			`expected ${elToString(el)} to match '${exp}'`
		);
	} else if (el instanceof HTMLElement) {
		assert(
			el.matches(exp),
			`expected ${elToString(el)} to match '${exp}'`
		);		
	}
};
