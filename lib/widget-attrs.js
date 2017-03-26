"use strict";

const DomUtil = require('./dom-util');

// private symbol to HTML element instance
const el = Symbol("el");

/**
 * Class wrapping HTML element attributes.
 * @type {WidgetAttributes}
 */
class WidgetAttributes {

	/**
	 * Create WidgetAttributes wrapper for the given HTML element.
	 * @param  {HTMLElement} element Element to wrap
	 */
	constructor(element) {
		if (!DomUtil.isElement(element)) {
			throw new Error('Element must be instance of HTMLElement');
		}
		this[el] = element;
	}

	/**
	 * Get attribute by name
	 * @param  {String} name Attribute name
	 * @return [String]      Attribute value
	 */
	get(name) {
		return this[el].getAttribute(name);
	}

	/**
	 * Set attribute value for given name
	 * @param {String} name  Attribute name
	 * @param {String} value Attribute value
	 */
	set(name, value) {
		this[el].setAttribute(name, value);
	}

	/**
	 * Remove attribute with given name
	 * @param  {String} name Attribute name
	 * @return [String]      Attribute value before remove
	 */
	remove(name) {
		let value = this.get(name);
		this[el].removeAttribute(name);
		return value;
	}

	/**
	 * Check if attribute with given name exists
	 * @param  {String} name Attribute name
	 * @return Boolean       True if attribute exists
	 */
	has(name) {
		return this[el].hasAttribute(name);
	}
}
module.exports = WidgetAttributes;
