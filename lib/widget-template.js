const l = require('log').get('template');

const dom = require('./dom-util');
const Widget = require('./widget');

const TEMPLATE_TAG = 'template';

const _content = Symbol('content');

class Template extends Widget {
	constructor(selector, parent) {
		let element = selector;
		if (typeof selector === 'string') {
			element = dom.query(selector, parent);
		}
		if (element instanceof Widget) {
			element = element.el;
		}

		if (!element || !dom.isElement(element)) {
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

	get content() {
		return this[_content];
	}


	/**
	 * Update template DOM content.
	 *
	 * Data objects first level keys are used as query selector strings
	 * to find matching elements from the parent, and the associated data
	 * is used to update those elements.
	 *
	 * @param {Object} data Object containing the data for update.
	 */
	update(data) {
		if (data != null) {
			Object.keys(data).forEach((selector) =>
				this.updateElement(selector, data[selector]));
		}
	}

	/**
	 * Update template DOM content with the given data.
	 *
	 * @param {string} selector Query selector string.
	 * @param {Object} data Object containing the data for update.
	 */
	updateElement(selector, data) {
		let elements = this.content.querySelectorAll(selector);
		Array.from(elements).forEach(element =>
			dom.updateElement(element, data));
	}

	clone(data) {}
}
module.exports = Template;
