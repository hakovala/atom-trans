"use strict";

const util = require('util');

const DomUtil = require('./dom-util');
const Widget = require('./widget');

class WidgetList extends Array {

	constructor(elements) {
		super();

		// convert single item to array of items
		if (!Array.isArray(elements)) {
			elements = [elements];
		}

		elements.forEach((el) => {
			this.push(el);
		});
	}

	/**
	 * Convert array-like object containing HTMLElements or Widgets
	 * to WidgetList.
	 * @param  {array} other Array-like object.
	 * @return {WidgetList}       Created WidgetList from items.
	 */
	static from(other) {
		// ensure that `other` is an Array
		other = Array.from(other);
		return new WidgetList(other);
	}

	/**
	 * Returns an array that contains the HTMLElements from Widget items.
	 * @return {array} Array of HTMLElements
	 */
	elements() {
		return this.map((item) => item.el);
	}

	/**
	 * Push one or more HTMLElements or Widgets to WidgetList.
	 * @param  {HTMLElement|Widget} el Element to add.
	 * @return {number} The new length property of the list.
	 */
	push(el) {
		if (DomUtil.isElement(el)) {
			el = new Widget(el);
		}
		if (el instanceof Widget) {
			return Array.prototype.push.call(this, el);
		}
		return this.length;
	}

	/**
	 * Unshift one or more HTMLElements or Widgets to WidgetList.
	 * @param {HTMLElement|Widget} el Element to add.
	 * @return {number} The new length property of the list.
	 */
	unshift(el) {
		if (DomUtil.isElement(el)) {
			el = new Widget(el);
		}
		if (el instanceof Widget) {
			return Array.prototype.unshift.call(this, el);
		}
		return this.length;
	}

	/**
	 * Set every items html to the given value.
	 * @param {string} value HTML string
	 */
	setHTML(value) {
		this.forEach((el) => {
			el.html = value;
		});
	}

	/**
	 * Set every items text to the given value.
	 * @param {string} value Text string
	 */
	setText(value) {
		this.forEach((el) => {
			el.text = value;
		});
	}
}
module.exports = WidgetList;
