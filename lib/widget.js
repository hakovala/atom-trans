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
 * @return {Widget} Removed child element.
 */
Widget.prototype.remove = function(value) {
	throw "Not implemented";
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
	throw "Not implemented";
};

/**
 * Append this {@link Widget} to specified parent.
 * @param {Widget|HTMLElement} parent Parent element to append to.
 */
Widget.prototype.appendTo = function(parent) {
	throw "Not implemented";
};

/**
 * Prepend child to this {@link Widget}.
 * @param {Widget|HTMLElement} child Child element to prepend.
 */
Widget.prototype.prepend = function(child) {
	throw "Not implemented";
};

/**
 * Prepend this {@link Widget} to specified parent.
 * @param {Widget|HTMLElement} parent Parent element to prepend to.
 */
Widget.prototype.prependTo = function(parent) {
	throw "Not implemented";
};

/**
 * Insert child to this {@link Widget} at specified index.
 * @param  {number} index Insert position
 * @param  {Widget|HTMLElement} child Child object to insert.
 */
Widget.prototype.insert = function(index, child) {
	throw "Not implemented";
};

/**
 * Insert this {@link Widget} after the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.insertAfter = function(other) {
	throw "Not implemented";
};

/**
 * Insert this {@link Widget} before the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.insertBefore = function(other) {
	throw "Not implemented";
};

/**
 * Replace the other element with this {@link Widget}.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.replace = function(other) {
	throw "Not implemented";
};

/**
 * Replace this {@link Widget} with the other element.
 * @param  {Widget|HTMLElement} other Other element.
 */
Widget.prototype.replaceWith = function(other) {
	throw "Not implemented";
};

/**
 * Find child elements that match the selector.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched child elements.
 */
Widget.prototype.find = function(selector) {
	throw "Not implemented";
};

/**
 * Get the first child element.
 * @return {Widget} First child element.
 */
Widget.prototype.first = function() {
	throw "Not implemented";
};

/**
 * Get the last child element.
 * @return {Widget} Last child element.
 */
Widget.prototype.last = function() {
	throw "Not implemented";
};

/**
 * Get the next sibling element.
 * If a selector is given, it retrieves the next matching element.
 * @param  {string}   selector Query selector string.
 * @return {Widget}          Next matched element.
 */
Widget.prototype.next = function(selector) {
	throw "Not implemented";
};

/**
 * Get all siblings after this {@link Widget}.
 * If a selector is given, only matching sibling elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched elements.
 */
Widget.prototype.nextAll = function(selector) {
	throw "Not implemented";
};

/**
 * Get the previous sibling element.
 * If a selector is given, it retrieves the previous matching element.
 * @param  {string} selector Query selector string.
 * @return {Widget}          Previous matched element.
 */
Widget.prototype.previous = function(selector) {
	throw "Not implemented";
};

/**
 * Get all siblings before this {@link Widget}.
 * If a selector is given, only matching sibling elements are returned.
 * @param  {string} selector Query selector string.
 * @return {WidgetList}          WidgetList containing matched elements.
 */
Widget.prototype.previousAll = function(selector) {
	throw "Not implemented";
};

/**
 * Matches this element against the given query selector.
 * @param  {string} selector Query selectot string.
 * @return {boolean}          `true` if this {@link Widget} matches the given selector.
 */
Widget.prototype.matches = function(selector) {
	throw "Not implemented";
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
