"use strict";

// RegExp for checking if string is HTML
const re_html = /^\s*<(\w+|!)[^>]*>/;

/**
 * DomUtil class contains collection of static methods for common
 * DOM functions.
 */
class DomUtil {

	/**
	 * Check whether the given object is a DOM Element.
	 */
	static isElement(obj) {
		return !!(obj && obj.nodeType === 1);
	}

	/**
	 * Check whether the given object is a DOM Text Node.
	 */
	static isTextNode(obj) {
		return !!(obj && obj.nodeType === 3);
	}

	/**
	 * Check whether the given object is a DOM Document.
	 */
	static isDocument(obj) {
		return !!(obj && obj.nodeType === 9);
	}

	/**
	 * Check whether the given object is a DOM Document Fragment.
	 */
	static isDocumentFragment(obj) {
		return !!(obj && obj.nodeType === 11);
	}

	/**
	 * Check whether the given string is HTML.
	 */
	static isHTML(str) {
		return re_html.test(str);
	}

	/**
	 * Query given selector from element or from whole document.
	 */
	static query(selector, parent) {
		parent = parent || document;
		return parent.querySelector(selector);
	}

	/**
	 * Query given selector from element or from whole document.
	 */
	static queryAll(selector, parent) {
		parent = parent || document;
		return Array.from(parent.querySelectorAll(selector));
	}

	/**
	 * Check whether the given element matches the selector.
	 */
	static matches(element, selector) {
		if (!selector || !DomUtil.isElement(element)) {
			return false;
		}
		return element.matches(selector);
	}

	/**
	 * Filter array of elements using given query selector.
	 */
	static filter(elements, selector) {
		// convert array-like objects to array and wrap anything else in array.
		elements = Array.from(elements);

		let result;
		if (typeof selector === 'undefined') {
			// return all elements if no selector is given
			result = elements;
		} else if (typeof selector === 'function') {
			// use given function as a callback for the Array filter
			result = elements.filter(selector);
		} else {
			result = elements.filter((e) => DomUtil.matches(e, selector));
		}
		return result;
	}

	/**
	 * Find a parent element that satisfies the query selector.
	 */
	static findParent(element, selector, until) {
		if (!DomUtil.isElement(element)) {
			return null;
		}

		while (element) {
			if (DomUtil.matches(element, selector)) {
				return element;
			} else if (until && DomUtil.matches(element, until)) {
				return false;
			}

			element = element.parentElement;
		}
		return false;
	}
}
module.exports = DomUtil;
