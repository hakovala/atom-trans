/* jshint mocha: true */
"use strict";

const helper = require('./helper');
const assert = require('./assert-dom');

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

			assert.equal(actual, expected);
		});

		it('should set innerHTML', () => {
			let html = '<div id="foo"></div>';

			target.html = html;
			assert.equal(target.el.innerHTML, html);
		});
	});

	describe('.outerHtml', () => {
		it('should get outerHTML', () => {
			let expected = target.el.outerHTML;
			let actual = target.outerHtml;

			assert.equal(actual, expected);
		});

		it('should set outerHTML', () => {
			let parent = target.el.parentNode;
			let html = '<div id="foo"></div>';

			target.outerHtml = html;
			assert(helper.query('#foo') !== null);
			assert(helper.query('#title') === null);
		});
	});

	describe('.text', () => {
		it('should get textContent', () => {
			let expected = target.el.textContent;
			let actual = target.text;

			assert.equal(actual, expected);
		});

		it('should set textContent', () => {
			let text = 'Hello, Test!';

			target.text = text;
			assert.equal(target.el.textContent, text);
		});
	});
});
