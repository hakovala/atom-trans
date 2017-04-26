"use strict";

const DomUtil = require('./dom-util');
const Widget = require('./widget');

const TEMPLATE_TAG = 'template';

const _content = Symbol('content');

/**
 * Template element wrapper.
 *
 * @class
 * @augments Widget
 */
class Template extends Widget {
	constructor(element) {
		// ensure that the `element` is a HTMLElement, or create new template
		// HTMLElement if not
		if (!element || !DomUtil.isElement(element)) {
			element = document.createElement(TEMPLATE_TAG);
		}

		// if `element` is not a template, then wrap it in a new template
		if (element.nodeName !== 'TEMPLATE') {
			let wrapper = document.createElement(TEMPLATE_TAG);
			wrapper.content.appendChild(element);
			element = wrapper;
		}

		// pass template element to the super
		super(element);
		// wrap template content in to a Widget
		this[_content] = element.content;
	}

	/**
	 * Get the template content Widget.
	 * @readonly
	 * @return {Widget} Template elements content as a Widget object
	 */
	get content() {
		return this[_content];
	}

	/**
	 * Update template content with the given data.
	 * @param  {Object} data Content as a object
	 * @return {Template}    Self
	 */
	update(data) {
		DomUtil.updateElementAll(this.content, data);
		return this;
	}

	/**
	 * Update content elements matching the given selector with the given data.
	 * @param  {String} selector Query selector string
	 * @param  {Object} data     Content as a object
	 * @return {Tempalte}        Self
	 */
	updateElement(selector, data) {
		DomUtil.updateElement(this.content, selector, data);
		return this;
	}

	/**
	 * Clone template content as a HTMLElement.
	 * If optional `data` is given, then that data is updated to the cloned
	 * element, template data is not changed.
	 * @param  {Object=} data Content as a object
	 * @return {Widget}  Cloned HTMLElement instance as Widget
	 */
	clone(data) {
		let doc = document.importNode(this.content, true);
		// bind data to element after cloning so that custom properties are preserved
		if (data) {
			DomUtil.updateElementAll(doc, data);
		}
		return new Widget(doc);
	}
}
module.exports = Template;
