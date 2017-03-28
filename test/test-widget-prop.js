/* jshint mocha: true */
"use strict";

const helper = require('./helper');
const assert = require('./assert/dom');

const Widget = require('../lib/widget');

const test_html = `
<div id="parent">
	<h1 id="title">Hello, Title!</h1>
	<div id="child-1" class="child first"></div>
	<div id="child-2" class="child"></div>
	<div id="child-3" class="child"></div>
	<div id="child-4" class="child last"></div>
</div>
`;

describe('Widget Properties', () => {
	let target;

	beforeEach(() => {
		// clean up test html body
		document.body.innerHTML = test_html;

		// prepare target widget for each test
		target = new Widget(helper.query('#title'));
	});

	describe('.html', () => {
		it('should get innerHTML', () => {
			let expected = target.el.innerHTML;
			let actual = target.html;

			assert(actual).equal(expected);
		});

		it('should set innerHTML', () => {
			let html = '<div id="foo"></div>';

			target.html = html;
			assert(target.el.innerHTML).equal(html);
		});
	});

	describe('.outerHtml', () => {
		it('should get outerHTML', () => {
			let expected = target.el.outerHTML;
			let actual = target.outerHtml;

			assert(actual).equal(expected);
		});

		it('should set outerHTML', () => {
			let parent = target.el.parentNode;
			let html = '<div id="foo"></div>';

			target.outerHtml = html;
			assert(helper.query('#foo')).notNull();
			assert(helper.query('#title')).isNull();
		});
	});

	describe('.text', () => {
		it('should get textContent', () => {
			let expected = target.el.textContent;
			let actual = target.text;

			assert(actual).equal(expected);
		});

		it('should set textContent', () => {
			let text = 'Hello, Test!';

			target.text = text;
			assert(target.el.textContent).equal(text);
		});
	});

	describe('.class', () => {
		it('should get classList', () => {
			let expected = target.el.classList;
			let actual = target.class;

			assert(actual).strictEqual(expected);
		});
	});

	describe('.style', () => {
		it('should get CSS style', () => {
			let expected = target.el.style;
			let actual = target.style;

			assert(actual).strictEqual(expected);
		});
	});
});
