"use strict";

const l = require('log').get('dom');

// RegExp for checking if string is HTML
const re_html = /^\s*<(\w+|!)[^>]*>/;

/**
 * DomUtil class contains collection of static methods for common
 * DOM functions.
 */
class DomUtil {

	/**
	 * @ignore
	 */
	constructor() {
		throw new Error('DomUtil should not be instantiated');
	}

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

	static ensureElement(selector, parent) {
		let element = selector;
		if (typeof element === 'string') {
			element = DomUtil.query(selector, parent);
		}

		if (!DomUtil.isElement(element)) {
			throw new Error("'element' must be DOM element");
		}
		return element;
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

	static updateElementValue(element, name, value) {
		if (typeof value === 'function') {
			value = value(element);
		}
		if (typeof value === 'object' && !Array.isArray(value)) {
			DomUtil.updateElement(element, name, value);
		}

		if (name === '_') {
			// l("update text: %o", value);
			element.textContent = value;
		} else
		if (name == '$') {
			// l("update html: %o", value);
			element.innerHTML = value;
		} else
		if (name == '#') {
			// l("update id: %o", value);
			element.id = value;
		} else
		if (name === '.') {
			// l("update class: %o", value);
			element.className = value;
		} else
		if (name.startsWith('.')) {
			let attr = name.slice(1);
			// l("update attr %s: %s", attr, value);
			element.setAttribute(attr, value);		
		} else {
			console.warn("Unknown `updateElementValue` name: '" + name + "'");
		}
		return element;
	}

	static updateElement(element, selector, data) {
		if (element) {
			// l("update target: '%s' => %o", selector, data);
			let targets = element.querySelectorAll(selector);
			for (let name in data) {
				const value = data[name];
				for (let target of targets) {
					DomUtil.updateElementValue(target, name, value);
				}
			}
		} else {
			console.warn('Can not update null element');
		}
	}

	static updateElementAll(element, data) {
		for (let selector in data) {
			// l("update: '%s' => %o", selector, data[selector]);
			DomUtil.updateElement(element, selector, data[selector]);
		}
	}
}
module.exports = DomUtil;
