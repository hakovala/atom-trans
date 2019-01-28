"use strict";

const dom = require('./lib/dom-util');
const Widget = require('./lib/widget');
const WidgetEvent = require('./lib/widget-event');

const trans = function(selector, parent) {
	return Widget.query(selector, parent);
};

trans.all = function(selector, parent) {
	return Widget.queryAll(selector, parent);
};
trans.dom = dom;
trans.Widget = Widget;
trans.Event = WidgetEvent;

module.exports = trans;
