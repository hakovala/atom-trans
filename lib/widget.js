"use strict";

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const domUtil = require('./dom-util');

function Widget(element) {
	if (!(this instanceof Widget))
		return new Widget(element);

	if (element !== undefined && !domUtil.isElement(element)) {
		throw new Error("'element' must be undefined or HTMLElement");
	}

	EventEmitter.call(this);

	this.el = element;
}
util.inherits(Widget, EventEmitter);
module.exports = Widget;

Widget.prototype.append = function() {
	throw "Not implemented";
};

