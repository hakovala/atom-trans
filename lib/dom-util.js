"use strict";

// RegExp for checking if string is HTML
const re_html = /^\s*<(\w+|!)[^>]*>/;

const slice = Array.prototype.slice;

/**
 * Check whether the given object is a DOM Element.
 */
function isElement(obj) {
	return !!(obj && obj.nodeType === 1);
}

/**
 * Check whether the given object is a DOM Text Node.
 */
function isTextNode(obj) {
	return !!(obj && obj.nodeType === 3);
}

/**
 * Check whether the given object is a DOM Document.
 */
function isDocument(obj) {
	return !!(obj && obj.nodeType === 9);
}

/**
 * Check whether the given object is a DOM Document Fragment.
 */
function isDocumentFragment(obj) {
	return !!(obj && obj.nodeType === 11);
}

/**
 * Check whether the given string is HTML.
 */
function isHTML(str) {
	return re_html.test(html);
}

/**
 * Query given selector from element or from whole document.
 */
function query(selector, parent) {
	parent = parent || document;
	return parent.querySelector(selector);
}

/**
 * Query given selector from element or from whole document.
 */
function queryAll(selector, parent) {
	parent = parent || document;
	return slice.call(parent.querySelectorAll(selector));
}

/**
 * Check whether the given element matches the selector.
 */
function matches(element, selector) {
	if (!selector || isElement(element))
		return false;
	return element.matches(selector);
}

/**
 * Filter array of elements using given query selector.
 */
function filter(elements, selector) {
	// convert array-like objects to array and wrap anything else in array.
	elements = slice.call(elements);

	let result;
	if (typeof selector === 'undefined') {
		// return all elements if no selector is given
		result = elements;
	} else if (typeof selector === 'function') {
		// use given function as a callback for the Array filter
		result = elements.filter(selector);
	} else {
		result = elements.filter((e) => matches(e, selector));
	}
	return result;
}

/**
 * Find a parent element that satisfies the query selector.
 */
function findParent(element, selector, until) {
	if (!isElement(element))
		return null;

	while (element) {
		if (matches(element, selector)) {
			return element;
		} else if (until && matches(element, until)) {
			return false;
		}

		element = element.parentElement;
	}
	return false;
}

module.exports = {
	isElement,
	isTextNode,
	isDocument,
	isDocumentFragment,
	isHTML,

	query,
	queryAll,
	matches,
	filter,
	findParent,
};
