/* jshint mocha: true */

require('log-node')();
const l = require('log');

const helper = require('./helper');
const assert = require('./assert/dom');

const Widget = require('../lib/widget');
const Template = require('../lib/widget-template');

const TEST_HTML = `
<template id="tmpl-1">
	<div class="header">
		<h1 class="header-title">Title</h1>
		<p>Lorem ipsum!</p>
	</div>
</template>
<template>
	<li>
		<h1 class="item-title">Hello Item!</h1>
		<p>Item content</p>
	</li>
</template>
`;

function printSupers(obj, depth) {
	depth = depth || 0;

	let proto = Object.getPrototypeOf(obj);

	if (proto) {
		console.log('  '.repeat(depth) + proto.constructor.name);
		printSupers(proto, depth + 1);
	}
}

describe('Template', () => {

	beforeEach(() => {
		// ensure clean `document.body`
		document.body.innerHTML = TEST_HTML;
	});

	describe('constructor', () => {
		it('should wrap template element', () => {
			let el = helper.query('#tmpl-1');
			let tmpl = new Template(el);

			assert(tmpl.el).strictEqual(el);
		});

		it('should create new template element as default', () => {
			let tmpl = new Template();

			assert(tmpl.el).instanceOf(HTMLTemplateElement);
			assert(tmpl.el.nodeName).equal('TEMPLATE');
			assert(tmpl.content).instanceOf(DocumentFragment);
		});

		it('should wrap non-template elements', () => {
			let el = helper.element('div', 'hello');
			let tmpl = new Template(el);

			assert(tmpl.el).instanceOf(HTMLTemplateElement);
			assert(tmpl.el.nodeName).equal('TEMPLATE');

			let actual = tmpl.content.querySelector('#hello');
			assert(actual).strictEqual(el);
		});

		it('should query element from string', () => {
			let tmpl = new Template('#tmpl-1');

			assert(tmpl.el).strictEqual(helper.query('#tmpl-1'));
		});

		it('should take element from Widget', () => {
			let widget = new Widget('#tmpl-1');
			let tmpl = new Template(widget);

			assert(tmpl.el).strictEqual(widget.el);
		});
	});

	describe('.content', () => {
		it('should have template content', () => {
			let el = helper.query('#tmpl-1');
			let tmpl = new Template(el);

			assert(tmpl.content).strictEqual(el.content);
		});
	});

	describe('#update', () => {
		it('should update template values', () => {
			let el = helper.query('#tmpl-1')
			let tmpl = new Template(el);

			tmpl.update({'.header-title': { '_': "world"}});

			l("%s", tmpl.html);
			l("%s", tmpl.content.querySelector(".header-title").html);

			//assert(false).isTrue();
		});
	});

	describe('#updateElement', () => {
		it('should update template values for elements matching selector', () => {
			let el = helper.query('#tmpl-1');
			let tmpl = new Template(el);

			tmpl.updateElement('.header-title', { '#': 'title' });
			assert(false).isTrue();
		});
	});

	describe('#clone', () => {
		it('should return new element from template', () => {
			let el = helper.query('#tmpl-1');
			let tmpl = new Template(el);

			let actual = tmpl.clone();
		});

		it('should return new element with data from template', () => {
			let el = helper.query('#tmpl-1');
			let tmpl = new Template(el);

			let actual = tmpl.clone({});
		});
	});
});
