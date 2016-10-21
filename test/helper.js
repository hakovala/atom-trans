"use strict";

function elementToString(el) {
	let type = el.constructor.name;
	let tag = el.tagName.toLowerCase();
	let id = el.id || '';
	let classes = Array.from(el.classList).join('.');

	let attrs = Array.from(el.attributes).filter((attr) => {
		return attr.name !== 'id' && attr.name !== 'class';
	}).map((attr) => {
		let str = attr.name;
		if (attr.value) {
			str += `="${attr.value}"`;
		}
		return `[${str}]`;
	}).join();

	return `(${type}) ${tag}#${id}.${classes} ${attrs}`;
}

function arrayToString(arr) {
	let type = arr.constructor.name;
	if (arr.length === 0) {
		return `${type} [ ]`;
	}
	let list = Array.from(arr).slice(0, 5).map(toString);
	if (arr.length > 5) {
		list.push(`... (${el.length - 5} more)`);
	}
	list = list.map((item) => '\t' + item);

	return `${type} [\n${list.join('\n')}\n]`;
}

function toString(obj) {
	if (obj instanceof NodeList ||
		obj instanceof HTMLCollection ||
		Array.isArray(obj)) {
		return arrayToString(obj);
	} else if (obj instanceof HTMLElement) {
		return elementToString(obj);
	} else {
		return `[${typeof obj}] ${obj.toString()}`;
	}
}

function inspect(obj, name) {
	let str = '';
	if (name) {
		str += name + ': ';
	}
	console.log(str + toString(obj));
}

/**
 * Create new Element
 */
function element(tag, id, classes) {
	let el = document.createElement(tag || 'div');
	if (id) el.id = id;
	if (classes) el.className = classes;
	return el;
}

/**
 * Query Element from document or given parent.
 */
function query(selector, parent) {
	parent = parent || document;
	return parent.querySelector(selector);
}

/**
 * Query all Elements from document or given parent.
 * Converts the result NodeList to Array.
 */
function queryAll(selector, parent) {
	parent = parent || document;
	return Array.from(parent.querySelectorAll(selector));
}

module.exports = {
	toString,
	inspect,
	element,
	query,
	queryAll,
};
