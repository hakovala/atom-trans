"use strict";

function elementToString(el) {
	let str = el.tagName.toLowerCase();
	if (el.id) str += `#${el.id}`;
	if (el.className) str += `.${String(el.className).replace('\s+', '.')}`;
	Array.from(el.attributes, (attr) => {
		if (attr.name !== 'class' && attr.name !== 'id') {
			str += `[${attr.name}${attr.value && '="' + attr.value + '"'}]`;
		}
	});
	return `[${str}]`;
}

function arrayToString(arr) {
	if (arr.length === 0) return 'empty Array';
	let str = Array.from(arr).slice(0, 5)
		.map(toString).join(', ');
	return arr.length > 5 ? str + `... (${el.length - 5} more)` : str;
}

function toString(obj) {
	if (obj instanceof NodeList ||
		obj instanceof HTMLCollection ||
		Array.isArray(obj)) {
		return arrayToString(obj);
	} else if (obj instanceof HTMLElement) {
		return elementToString(obj);
	} else {
		return 'unknonw';
	}
}

module.exports = {
	toString: toString,
	inspect: function(el) {
		console.log(toString(el));
	}
};
