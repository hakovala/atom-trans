/* jshint mocha: true */
"use strict";

const helper = require('./helper');
const assert = require('./assert/dom');

const Widget = require('../lib/widget');
const WidgetAttributes = require('../lib/widget-attrs');

const test_html = `
<div id="element" class="class-1 class-2" value="hello" data-value="world">
</div>
`;

describe('Widget Attributes', () => {
	let target;

	beforeEach(() => {
		// clean up test html body
		document.body.innerHTML = test_html;

		// prepare target widget for each test
		target = new Widget(helper.query('#element'));
	});

	describe('WidgetAttributes', () => {
		it('should throw Error with missing element', () => {
			assert(() => {
				let dummy = new WidgetAttributes();
			}).throws(Error, 'Should throw Error for missing element.');
		});

		it('should throw Error when passing string as element', () => {
			assert(() => {
				let dummy = new WidgetAttributes("Hello");
			}).throws(Error, 'Should throw Error for missing element.');
		});

		it('should throw Error when passing object as element', () => {
			assert(() => {
				let dummy = new WidgetAttributes({});
			}).throws(Error, 'Should throw Error for missing element.');
		});
	});

	describe('.attr', () => {
		it('should get attribute', () => {
			let expected = 'hello';
			let actual = target.attr.get('value');

			assert(actual).equal(expected);
		});

		it('should add new attribute', () => {
			target.attr.set('dummy', 'something');
			assert(target.el.getAttribute('dummy')).equal('something');
		});

		it('should change attribute', () => {
			target.attr.set('value', 'something');
			assert(target.el.getAttribute('value')).equal('something');
		});

		it('should remove attribute', () => {
			target.attr.remove('value');
			assert(target.el.hasAttribute('value')).isFalse();
		});

		it('should check attribute existance', () => {
			assert(target.attr.has('value')).isTrue();
			assert(target.attr.has('none')).isFalse();
		});
	});
});
