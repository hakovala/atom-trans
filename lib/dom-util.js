"use strict";

const l = require('log').get('dom');

const createElement = require('dom-create-element-query-selector');

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

	//
	// Update element methods
	//

	/**
	 * Get the value of element specified by the name.
	 * @param {Element} element DOM Element
	 * @param {string} name Name of the property.
	 */
	static getElementValue(element, name) {
		const op = name[0];
		switch(op) {
			case '_': return element.textContent;
			case '$': return element.innerHTML;
			case '#': return element.id;
			case '.':
				if (name.length > 1) {
					const attr = name.slice(1);
					return element.getAttribute(attr);
				} else {
					return element.className;
				}
				break;
			default:
				console.warn("Unknown value name: '" + name + "'");
				break;
		}
		return false;
	}

	/**
	 * Update one of the DOM elements property with the new value.
	 *
	 * Special `name` values:
	 *  - `_` : Text content
	 *  - `$` : Inner HTML
	 *  - `#` : Element id
	 *  - `.` : Element class attribute
	 *  - `.<attr name>` : Element attribute
	 *
	 * If the `value` is a function, then it will be called to get
	 * the value to set. Function arguments will be `(element, name, old_value)`.
	 *
	 * @param {Element} element DOM Element to update.
	 * @param {string} name Name of the property.
	 * @param {*} value Value to update.
	 */
	static setElementValue(element, name, value) {
		if (typeof value === 'function') {
			const prev = DomUtil.getElementValue(element, name);
			value = value(element, name, prev);
		}

		const op = name[0];
		switch(op) {
			case '_':
				element.textContent = value;
				break;
			case '$':
				element.innerHTML = value;
				break;
			case '#':
				element.id = value;
				break;
			case '.':
				if (name.length > 1) {
					const attr = name.slice(1);
					if (typeof value !== 'undefined') {
						element.setAttribute(attr, value);
					} else {
						element.removeAttribute(attr);
					}
				} else {
					element.className = value;
				}
				break;
			default:
				console.warn("Unknown value name: '" + name + "'");
				break;
		}
	}

	/**
	 * Update DOM element with the given data.
	 *
	 * @param {Element} element DOM Element to update.
	 * @param {Object} data Object containing the data for update.
	 */
	static updateElement(element, data) {
		if (element && data) {
			Object.keys(data).forEach((key) =>
				DomUtil.setElementValue(element, key, data[key]));
		}
	}

	/**
	 * Update multiple DOM elements within the given parent element.
	 *
	 * Data objects first level keys are used as query selector strings
	 * to find matching elements from the parent, and value is passed
	 * to `updateElement` with the matching elements.
	 *
	 * @param {Element} element Parent DOM element.
	 * @param {Object} data Object containing the data for update.
	 */
	static updateElementAll(element, data) {
		if (element && data) {
			Object.keys(data).forEach((key) => {
				let targets;
				if (key == '&') {
					targets = [element];
				} else {
					targets = element.querySelectorAll(key);
				}
				Array.from(targets).forEach(target =>
					DomUtil.updateElement(target, data[key]));
			});
		}
	}
}
DomUtil.create = createElement;

module.exports = DomUtil;
