const l = require('log').get('template');

const DomUtil = require('./dom-util');
const Widget = require('./widget');

const TEMPLATE_TAG = 'template';

const _content = Symbol('content');

class Template extends Widget {
	constructor(selector, parent) {
		let element = selector;
		if (typeof selector === 'string') {
			l("selector string: %s", selector);
			element = DomUtil.query(selector, parent);
		}
		if (element instanceof Widget) {
			l("widget element");
			element = element.el;
		}

		if (!element || !DomUtil.isElement(element)) {
			l("create element");
			element = document.createElement(TEMPLATE_TAG);
		}
		// if `element` is not a template, then wrap it in a new template
		if (element.nodeName !== TEMPLATE_TAG.toUpperCase()) {
			let wrapper = document.createElement(TEMPLATE_TAG);
			wrapper.content.appendChild(element);
			element = wrapper;
		}

		// pass template element to the super
		super(element);
		// wrap template content in to a Widget
		this[_content] = element.content;
	}

	get content() {}

	update(data) {}

	updateElement(selector, data) {}

	clone(data) {}
}
module.exports = Template;
