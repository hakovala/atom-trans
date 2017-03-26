"use strict";

const DomUtil = require('./dom-util');

// private symbol to HTML element instance
const el = Symbol("el");
const prefix = Symbol("prefix");

/**
 * Class wrapping HTML element attributes.
 * @type {WidgetAttributes}
 */
class WidgetAttributes {

	/**
	 * Get attribute name prefix
	 * @return [String] Attribute name prefix
	 */
	get prefix() { return this[prefix]; }

	/**
	 * Create WidgetAttributes wrapper for the given HTML element.
	 *
	 * If attribute name prefix is defined, attribute name used for the
	 * element is in format `<prefix>-<name>`. This is useful for
	 * creating WidgetAttributes for special types of attributes, like `data`.
	 *
	 * @param  {HTMLElement} element Element to wrap
	 * @param  {String}      _prefix Attribute name prefix
	 */
	constructor(element, _prefix) {
		if (!DomUtil.isElement(element)) {
			throw new Error('Element must be instance of HTMLElement');
		}
		this[el] = element;
		this[prefix] = _prefix || null;
	}

	/**
	 * Prefix the given attribute name with prefix set for this WidgetAttributes
	 * object. If prefix is not set then return the name as is.
	 * @param  {String} name Attribute name
	 * @return [String]      Prefixed attribute name
	 */
	prefixName(name) {
		if (typeof this[prefix] === 'string') {
			return `${this[prefix]}-${name}`;
		}
		return name;
	}

	/**
	 * Get attribute by name
	 * @param  {String} name Attribute name
	 * @return [String]      Attribute value
	 */
	get(name) {
		name = this.prefixName(name);
		return this[el].getAttribute(name);
	}

	/**
	 * Set attribute value for given name
	 * @param {String} name  Attribute name
	 * @param {String} value Attribute value
	 */
	set(name, value) {
		name = this.prefixName(name);
		this[el].setAttribute(name, value);
	}

	/**
	 * Remove attribute with given name
	 * @param  {String} name Attribute name
	 * @return [String]      Attribute value before remove
	 */
	remove(name) {
		name = this.prefixName(name);
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
		name = this.prefixName(name);
		return this[el].hasAttribute(name);
	}
}
module.exports = WidgetAttributes;
