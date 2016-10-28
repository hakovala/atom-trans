"use strict";

const util = require('util');

const domUtil = require('./dom-util');

function WidgetList(elements) {
	if (!(this instanceof WidgetList))
		return new WidgetList();

	Array.call(this);

	// convert single item to array of items
	if (!Array.isArray(elements)) {
		elements = [elements];
	}

	elements.forEach((el) => {
		// wrap HTMLElements to Widgets
		if (domUtil.isElement(el)) {
			el = new Widget(el);
		}
		// convert anything else to undefined
		if (!(el instanceof Widget)) {
			el = undefined;
		}
		this.push(el);
	});
}
util.inherits(WidgetList, Array);
module.exports = WidgetList;

// NOTE: Widget must be required after exporting WidgetList
// Otherwise the Widget doesn't have access to the WidgetList
const Widget = require('./widget');

/**
 * Convert array-like object containing HTMLElements or Widgets
 * to WidgetList.
 * @param  {array} other Array-like object.
 * @return {WidgetList}       Created WidgetList from items.
 */
WidgetList.from = function(other) {
	// convert to actual Array
	other = Array.from(other);
	return new WidgetList(other);
};

/**
 * Returns an array that contains the HTMLElements from Widget items.
 * @return {array} Array of HTMLElements
 */
WidgetList.prototype.elements = function() {
	return this.map((item) => item.el);
};

/**
 * Push one or more HTMLElements or Widgets to WidgetList.
 * @param  {HTMLElement|Widget} el Element to add.
 * @return {number} The new length property of the list.
 */
WidgetList.prototype.push = function(el) {
	if (domUtil.isElement(el)) {
		el = new Widget(el);
	}
	if (el instanceof Widget) {
		return Array.prototype.push.call(this, el);
	}
	return this.length;
};

/**
 * Unshift one or more HTMLElements or Widgets to WidgetList.
 * @param {HTMLElement|Widget} el Element to add.
 * @return {number} The new length property of the list.
 */
WidgetList.prototype.unshift = function(el) {
	if (domUtil.isElement(el)) {
		el = new Widget(el);
	}
	if (el instanceof Widget) {
		return Array.prototype.unshift.call(this, el);
	}
	return this.length;
};

/**
 * Set every items html to the given value.
 * @param {string} value HTML string
 */
WidgetList.prototype.setHTML = function(value) {
	this.forEach((el) => {
		el.html = value;
	});
};

/**
 * Set every items text to the given value.
 * @param {string} value Text string
 */
WidgetList.prototype.setText = function(value) {
	this.forEach((el) => {
		el.text = value;
	});
};
