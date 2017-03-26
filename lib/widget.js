"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const DomUtil = require('./dom-util');
const WidgetAttributes = require('./widget-attrs');

const _el = Symbol('element');
const _attr = Symbol('attr');
const _data = Symbol('data');

/**
 * Widget wrapper for HTML Element object.
 * @constructor
 * @param {HTMLElement} element HTML Element to wrap.
 */
class Widget extends EventEmitter {

	constructor(element) {
		super();

		// ensure that the 'element' is an Element
		if (!DomUtil.isElement(element)) {
			throw new Error("'element' must be HTMLElement");
		}

		this[_el] = element;
		this[_attr] = new WidgetAttributes(element);
		this[_data] = new WidgetAttributes(element, 'data');

		// TODO: Attach Widget instance to element as a weak reference
	}

	/**
	 * HTMLElement instance wrapped by this Widget
	 * @return [HTMLElement] HTMLElement instance
	 */
	get el() { return this[_el]; }

	/**
	 * Get inner HTML of the element.
	 * @return {String} Elements inner HTML
	 */
	get html() { return this.el.innerHTML; }
	/**
	 * Set inner HTML of the element.
	 * @param  {String} value String to set as inner HTML
	 */
	set html(value) { this.el.innerHTML = value; }

	/**
	 * Get outer HTML of the element.
	 * @return {String} Elements outer HTML
	 */
	get outerHtml() { return this.el.outerHTML; }
	/**
	 * Set outer HTML of the element.
	 * @param  {String} value String to set as outer HTML
	 * @return {[type]}       [description]
	 */
	set outerHtml(value) { this.el.outerHTML = value; }

	/**
	 * Get text content of the element.
	 * @return {String} Elements text content
	 */
	get text() { return this.el.textContent; }
	/**
	 * Set text content of the element.
	 * @param  {String} value String to set as text content
	 */
	set text(value) { this.el.textContent = value; }

	/**
	 * Get elements `classList`
	 * @return {ClassList} Elements class list object
	 */
	get class() { return this.el.classList; }

	/**
	 * Get elements `style`
	 * @return {Object} Elements CSS style object
	 */
	get style() { return this.el.style; }

	/**
	 * Get element attributes wrapper
	 * @return [WidgetAttributes] Element attributes
	 */
	get attr() { return this[_attr]; }

	/**
	 * Get element data attributes wrapper
	 * @return [WidgetAttributes] Element data attributes
	 */
	get data() { return this[_data]; }

	// -------------------
	//
	// DOM MANIPULATION
	//
	// -------------------

	/**
	 * Remove child from this {@link Widget}.
	 * @param {Widget|HTMLElement|string} value
	 * @return {WidgetList} Removed child element.
	 */
	remove(value) {
		if (value instanceof Widget) {
			return this.remove(value.el);
		}

		let removed = [];

		if (typeof value === 'string') {
			let selector = value;
			// TODO: Use 'children()' for getting the children list
			let children = Array.from(this.el.children);
			removed = children.filter((child) => {
				return DomUtil.matches(child, selector);
			}).map((child) => {
				return this.el.removeChild(child);
			});
		} else if (DomUtil.isElement(value)) {
			let el = value;
			removed = [this.el.removeChild(value)];
		} else {
			throw new Error('Expected Widget, HTMLElement or string as argument: ' + (typeof value));
		}

		return removed;
	}

	/**
	 * Detach this {@link Widget} from it's parent.
	 * @return {Widget} This @{link Widget} instance.
	 */
	detach() {
		this.el.parentNode.removeChild(this.el);
	}

	/**
	 * Append child to this {@link Widget}.
	 * @param {Widget|HTMLElement} child Child element to append.
	 */
	append(child) {
		if (child instanceof Widget) {
			return this.append(child.el);
		}
		if (!(child instanceof Node)) {
			throw new Error("Failed to execute 'append': parameter is not of type Widget or Node");
		}
		this.el.appendChild(child);
	}

	/**
	 * Append this {@link Widget} to specified parent.
	 * @param {Widget|HTMLElement} parent Parent element to append to.
	 */
	appendTo(parent) {
		if (parent instanceof Widget) {
			return this.appendTo(parent.el);
		}
		if (!(parent instanceof Node)) {
			throw new Error("Failed to execute 'appendTo': parameter is not of type Widget or Node");
		}
		parent.appendChild(this.el);
	}

	/**
	 * Prepend child to this {@link Widget}.
	 * @param {Widget|HTMLElement} child Child element to prepend.
	 */
	prepend(child) {
		if (child instanceof Widget) {
			return this.prepend(child.el);
		}
		if (!(child instanceof Node)) {
			throw new Error("Failed to execute 'prepend': parameter is not of type Widget or Node");
		}
		this.el.insertBefore(child, this.el.firstChild);
	}

	/**
	 * Prepend this {@link Widget} to specified parent.
	 * @param {Widget|HTMLElement} parent Parent element to prepend to.
	 */
	prependTo(parent) {
		if (parent instanceof Widget) {
			return this.prependTo(parent.el);
		}
		if (!(parent instanceof Node)) {
			throw new Error("Failed to execute 'prependTo': parameter is not of type Widget or Node");
		}
		parent.insertBefore(this.el, parent.firstChild);
	}

	/**
	 * Insert child to this {@link Widget} at specified index.
	 * @param  {number} index Insert position
	 * @param  {Widget|HTMLElement} child Child object to insert.
	 */
	insert(index, child) {
		if (child instanceof Widget) {
			return this.insert(index, child.el);
		}
		if (!(child instanceof Node)) {
			throw new Error("Failed to execute 'insert': parameter is not of type Widget or Node");
		}
		if (index < 0) {
			index = 0;
		}
		this.el.insertBefore(child, this.el.children[index]);
	}

	/**
	 * Insert this {@link Widget} after the other element.
	 * @param  {Widget|HTMLElement} other Other element.
	 */
	insertAfter(other) {
		if (other instanceof Widget) {
			return this.insertAfter(other.el);
		}
		if (!(other instanceof Node)) {
			throw new Error("Failed to execute 'insertAfter': parameter is not of type Widget or Node");
		}
		other.parentNode.insertBefore(this.el, other.nextSibling);
	}

	/**
	 * Insert this {@link Widget} before the other element.
	 * @param  {Widget|HTMLElement} other Other element.
	 */
	insertBefore(other) {
		if (other instanceof Widget) {
			return this.insertBefore(other.el);
		}
		if (!(other instanceof Node)) {
			throw new Error("Failed to execute 'insertBefore': parameter is not of type Widget or Node");
		}
		other.parentNode.insertBefore(this.el, other);
	}

	/**
	 * Replace the other element with this {@link Widget}.
	 * @param  {Widget|HTMLElement} other Other element.
	 */
	replace(other) {
		if (other instanceof Widget) {
			return this.replace(other.el);
		}
		if (!(other instanceof Node)) {
			throw new Error("Failed to execute 'replace': parameter is not of type Widget or Node");
		}
		other.parentNode.replaceChild(this.el, other);
	}

	/**
	 * Replace this {@link Widget} with the other element.
	 * @param  {Widget|HTMLElement} other Other element.
	 */
	replaceWith(other) {
		if (other instanceof Widget) {
			return this.replaceWith(other.el);
		}
		if (!(other instanceof Node)) {
			throw new Error("Failed to execute 'replaceWith': parameter is not of type Widget or Node");
		}
		this.el.parentNode.replaceChild(other, this.el);
	}

	/**
	 * Find child elements that match the selector.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList containing matched child elements.
	 */
	find(selector) {
		if (typeof selector !== 'string') {
			throw new Error("Failed to execute 'find': parameter is not of type string");
		}

		// TODO: Return WidgetList object
		return DomUtil.queryAll(selector, this.el)
			.map((el) => new Widget(el));
	}

	/**
	 * Get the first child element.
	 * @return {Widget} First child element.
	 */
	first() {
		let first = this.el.firstElementChild;
		return first ? new Widget(first) : null;
	}

	/**
	 * Get the last child element.
	 * @return {Widget} Last child element.
	 */
	last() {
		let last = this.el.lastElementChild;
		return last ? new Widget(last) : null;
	}

	/**
	 * Get the next sibling element.
	 * If a selector is given, it retrieves the next matching element.
	 * @param  {string}   selector Query selector string.
	 * @return {Widget}          Next matched element.
	 */
	next(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'next': parameter is not of type string");
		}

		let next = this.el;
		do {
			next = next.nextElementSibling;
		} while((next && selector) && !next.matches(selector));

		return next ? new Widget(next) : null;
	}

	/**
	 * Get all siblings after this {@link Widget}.
	 * If a selector is given, only matching sibling elements are returned.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList containing matched elements.
	 */
	nextAll(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'next': parameter is not of type string");
		}

		let res = [];
		let next = this.el;
		while ((next = next.nextElementSibling)) {
			if (!selector || next.matches(selector)) {
				res.push(next);
			}
		}

		return res.map((el) => new Widget(el));
	}

	/**
	 * Get the previous sibling element.
	 * If a selector is given, it retrieves the previous matching element.
	 * @param  {string} selector Query selector string.
	 * @return {Widget}          Previous matched element.
	 */
	previous(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'previous': parameter is not of type string");
		}

		function match(el, selector) {
			// TODO: Refactor this checking method, there must be more cleaner solution
			if (!el || !selector) {
				return false;
			}
			return !el.matches(selector);
		}

		let prev = this.el;
		do {
			prev = prev.previousElementSibling;
		} while(match(prev, selector));

		return prev ? new Widget(prev) : null;
	}

	/**
	 * Get all siblings before this {@link Widget}.
	 * If a selector is given, only matching sibling elements are returned.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList containing matched elements.
	 */
	previousAll(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'previousAll': parameter is not of type string");
		}

		let res = [];
		let prev = this.el;
		while ((prev = prev.previousElementSibling)) {
			if (!selector || prev.matches(selector)) {
				res.push(prev);
			}
		}

		return res.map((el) => new Widget(el));
	}

	/**
	 * Matches this element against the given query selector.
	 * @param  {string} selector Query selectot string.
	 * @return {boolean}          `true` if this {@link Widget} matches the given selector.
	 */
	matches(selector) {
		if (typeof selector !== 'string') {
			throw new Error("Failed to execute 'matches': parameter is not of type string");
		}
		return this.el.matches(selector);
	}

	/**
	 * Get the parent element.
	 * If a selector is given, it retrieves the first matching parent element.
	 * @param {string} selector Query selector string.
	 * @return {Widget} Parent element.
	 */
	parent(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'parent': parameter is not of type string");
		}

		let parent = this.el;
		do {
			parent = parent.parentNode;
			if (!DomUtil.isElement(parent)) {
				parent = null;
			}
		} while((parent && selector) && !parent.matches(selector));

		return parent ? new Widget(parent) : null;
	}

	/**
	 * Get all parent elements.
	 * If a selector is given, only matching parent elements are returned.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList of parent elements.
	 */
	parentAll(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'parentAll': parameter is not of type string");
		}

		let res = [];
		let parent = this.el;
		do {
			parent = parent.parentNode;
			if (DomUtil.isElement(parent)) {
				if (!selector || parent.matches(selector)) {
					res.push(parent);
				}
			}
		} while (DomUtil.isElement(parent));

		return res.map((el) => new Widget(el));
	}

	/**
	 * Get this {@link Widget} children elements.
	 * If a selector is given, only matching child elements are returned.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList containing child elements.
	 */
	children(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'children': parameter is not of type string");
		}

		let res = Array.from(this.el.children);
		if (selector) {
			res = res.filter((e) => e.matches(selector));
		}
		return res.map((e) => new Widget(e));
	}

	/**
	 * Get this {@link Widget} sibling elements.
	 * If a selector is given, only matching sibling elements are returned.
	 * @param  {string} selector Query selector string.
	 * @return {WidgetList}          WidgetList containing sibling elements.
	 */
	siblings(selector) {
		if (selector !== undefined && typeof selector !== 'string') {
			throw new Error("Failed to execute 'siblings': parameter is not of type string");
		}

		let res = [];
		if (this.el.parentNode) {
			let next = this.el.parentNode.firstElementChild;
			do {
				if (next !== this.el) {
					if (!selector || next.matches(selector)) {
						res.push(next);
					}
				}
			}	while((next = next.nextElementSibling));
		}

		return res.map((e) => new Widget(e));
	}

	/**
	 * Get the first element that matches the selector by testing the element
	 * itself and traversing up through its ancestors.
	 * @param  {string} selector Query selector string
	 * @return {Widget}          Closest matching element.
	 */
	closest(selector) {
		if (typeof selector !== 'string') {
			throw new Error("Failed to execute 'closest': parameter is not of type string");
		}

		let closest = this.el.closest(selector);
		return closest ? new Widget(closest) : null;
	}
}
module.exports = Widget;
