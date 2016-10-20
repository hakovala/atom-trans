"use strict";

function elToString(el) {
	let desc;

	if (el instanceof NodeList || el instanceof HTMLCollection) {
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

module.exports = {
	toString: elToString,
	inspect: function(el) {
		console.log(elToString(el));
	}
};
