"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const domUtil = require('./dom-util');

/**
 * Widget wrapper for HTML Element object.
 * @constructor
 * @param {HTMLElement} element HTML Element to wrap.
 */
function Widget(element) {
	if (!(this instanceof Widget))
		return new Widget(element);

	// ensure that the 'element' is an Element
	if (!domUtil.isElement(element)) {
		throw new Error("'element' must be HTMLElement");
	}

	// initialize inherited EventEmitter
	EventEmitter.call(this);

	// make element holder property read-only
	Object.defineProperty(this, 'el', {
		value: element,
		enumerable: true,
	});
}
util.inherits(Widget, EventEmitter);
module.exports = Widget;

Object.defineProperties(Widget.prototype, {
	// set/get element 'innerHTML'
	'html': {
		get: function() { throw "Not implemented"; },
		set: function(value) { throw "Not implemented"; }
	},
	// set/get element 'textContent'
	'text': {
		get: function() { throw "Not implemented"; },
		set: function(value) { throw "Not implemented"; }
	},
});

/**
 * Remove child from this {@link Widget}.
 * @param {Widget|HTMLElement|string} value
 * @return {WidgetList} Removed child element.
 */
Widget.prototype.remove = function(value) {
	if (value instanceof Widget) {
		return this.remove(value.el);
	}

	let removed = [];

	if (typeof value === 'string') {
		let selector = value;
		// TODO: Use 'children()' for getting the children list
		let children = Array.from(this.el.children);
		removed = children.filter((child) => {
			return domUtil.matches(child, selector);
		}).map((child) => {
			return this.el.removeChild(child);
		});
	} else if (domUtil.isElement(value)) {
		let el = value;
		removed = [this.el.removeChild(value)];
	} else {
		throw new Error('Expected Widget, HTMLElement or string as argument: ' + (typeof value));
	}

	return removed;
};

/**
 * Detach this {@link Widget} from it's parent.
 * @return {Widget} This @{link Widget} instance.
 */
Widget.prototype.detach = function() {
	this.el.parentNode.removeChild(this.el);
};

/**
 * Append child to this {@link Widget}.
 * @param {Widget|HTMLElement} child Child element to append.
 */
Widget.prototype.append = function(child) {
	if (child instanceof Widget) {
		return this.append(child.el);
	}
	if (!(child instanceof Node)) {
		throw new Error("Failed to execute 'append': parameter is not of type Widget or Node");
	}
	this.el.appendChild(child);
};

/**
 * Append this {@link Widget} to specified parent.
 * @param {Widget|HTMLElement} parent Parent element to append to.
 */
Widget.prototype.appendTo = function(parent) {
	if (parent instanceof Widget) {
		return this.appendTo(parent.el);
	}
	if (!(parent instanceof Node)) {
		throw new Error("Failed to execute 'appendTo': parameter is not of type Widget or Node");
	}
	parent.appendChild(this.el);
};

/**
 * Prepend child to this {@link Widget}.
 * @param {Widget|HTMLElement} child Child element to prepend.
 */
Widget.prototype.prepend = function(child) {
	if (child instanceof Widget) {
		return this.prepend(child.el);
	}
	if (!(child instanceof Node)) {
		throw new Error("Failed to execute 'prepend': parameter is not of type Widget or Node");
	}
	this.el.insertBefore(child, this.el.firstChild);
};

/**
 * Prepend this {@link Widget} to specified parent.
 * @param {Widget|HTMLElement} parent Parent element to prepend to.
 */
Widget.prototype.prependTo = function(parent) {
	if (parent instanceof Widget) {
		return this.prependTo(parent.el);
	}
	if (!(parent instanceof Node)) {
		throw new Error("Failed to execute 'prependTo': parameter is not of type Widget or Node");
	}
	parent.insertBefore(this.el, parent.firstChild);
};

/**
 * Insert child to this {@link Widget} at specified index.
 * @param  {number} index Insert position
 * @param  {Widget|HTMLElement} child Child object to insert.
 */
Widget.prototype.insert = function(index, child) {
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
};

/**
 * Insert this {@link Widget} after the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.insertAfter = function(other) {
	if (other instanceof Widget) {
		return this.insertAfter(other.el);
	}
	if (!(other instanceof Node)) {
		throw new Error("Failed to execute 'insertAfter': parameter is not of type Widget or Node");
	}
	other.parentNode.insertBefore(this.el, other.nextSibling);
};

/**
 * Insert this {@link Widget} before the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.insertBefore = function(other) {
	if (other instanceof Widget) {
		return this.insertBefore(other.el);
	}
	if (!(other instanceof Node)) {
		throw new Error("Failed to execute 'insertBefore': parameter is not of type Widget or Node");
	}
	other.parentNode.insertBefore(this.el, other);
};

/**
 * Replace the other element with this {@link Widget}.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.replace = function(other) {
	if (other instanceof Widget) {
		return this.replace(other.el);
	}
	if (!(other instanceof Node)) {
		throw new Error("Failed to execute 'replace': parameter is not of type Widget or Node");
	}
	other.parentNode.replaceChild(this.el, other);
};

/**
 * Replace this {@link Widget} with the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.replaceWith = function(other) {
	if (other instanceof Widget) {
		return this.replaceWith(other.el);
	}
	if (!(other instanceof Node)) {
		throw new Error("Failed to execute 'replaceWith': parameter is not of type Widget or Node");
	}
	this.el.parentNode.replaceChild(other, this.el);
};

/**
 * Find child elements that match the selector.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched child elements.
 */
Widget.prototype.find = function(selector) {
	if (typeof selector !== 'string') {
		throw new Error("Failed to execute 'find': parameter is not of type string");
	}

	// TODO: Return WidgetList object
	return domUtil.queryAll(selector, this.el)
		.map((el) => new Widget(el));
};

/**
 * Get the first child element.
 * @return {Widget} First child element.
 */
Widget.prototype.first = function() {
	let first = this.el.firstElementChild;
	return first ? new Widget(first) : null;
};

/**
 * Get the last child element.
 * @return {Widget} Last child element.
 */
Widget.prototype.last = function() {
	let last = this.el.lastElementChild;
	return last ? new Widget(last) : null;
};

/**
 * Get the next sibling element.
 * If a selector is given, it retrieves the next matching element.
 * @param  {string}   selector Query selector string.
 * @return {Widget}          Next matched element.
 */
Widget.prototype.next = function(selector) {
	if (selector !== undefined && typeof selector !== 'string') {
		throw new Error("Failed to execute 'next': parameter is not of type string");
	}

	function match(el, selector) {
		// TODO: Refactor this checking method, there must be more cleaner solution
		if (!el || !selector) return false;
		return !el.matches(selector);
	}

	let next = this.el;
	do {
		next = next.nextElementSibling;
	} while(match(next, selector));

	return next ? new Widget(next) : null;
};

/**
 * Get all siblings after this {@link Widget}.
 * If a selector is given, only matching sibling elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched elements.
 */
Widget.prototype.nextAll = function(selector) {
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
};

/**
 * Get the previous sibling element.
 * If a selector is given, it retrieves the previous matching element.
 * @param  {string} selector Query selector string.
 * @return {Widget}          Previous matched element.
 */
Widget.prototype.previous = function(selector) {
	if (selector !== undefined && typeof selector !== 'string') {
		throw new Error("Failed to execute 'previous': parameter is not of type string");
	}

	function match(el, selector) {
		// TODO: Refactor this checking method, there must be more cleaner solution
		if (!el || !selector) return false;
		return !el.matches(selector);
	}

	let prev = this.el;
	do {
		prev = prev.previousElementSibling;
	} while(match(prev, selector));

	return prev ? new Widget(prev) : null;
};

/**
 * Get all siblings before this {@link Widget}.
 * If a selector is given, only matching sibling elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched elements.
 */
Widget.prototype.previousAll = function(selector) {
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
};

/**
 * Matches this element against the given query selector.
 * @param  {string} selector Query selectot string.
 * @return {boolean}          `true` if this {@link Widget} matches the given selector.
 */
Widget.prototype.matches = function(selector) {
	if (typeof selector !== 'string') {
		throw new Error("Failed to execute 'matches': parameter is not of type string");
	}
	return this.el.matches(selector);
};

/**
 * Get the parent element.
 * If a selector is given, it retrieves the first matching parent element.
 * @param {string} selector Query selector string.
 * @return {Widget} Parent element.
 */
Widget.prototype.parent = function(selector) {
	throw "Not implemented";
};

/**
 * Get all parent elements.
 * If a selector is given, only matching parent elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList of parent elements.
 */
Widget.prototype.parents = function(selector) {
	throw "Not implemented";
};

/**
 * Get this {@link Widget} children elements.
 * If a selector is given, only matching child elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing child elements.
 */
Widget.prototype.children = function(selector) {
	throw "Not implemented";
};

/**
 * Get this {@link Widget} sibling elements.
 * If a selector is given, only matching sibling elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing sibling elements.
 */
Widget.prototype.siblings = function(selector) {
	throw "Not implemented";
};

/**
 * Get the first element that matches the selector by testing the element
 * itself and traversing up through its ancestors.
 * @param  {string} selector Query selector string
 * @return {Widget}          Closest matching element.
 */
Widget.prototype.closest = function(selector) {
	throw "Not implemented";
};
