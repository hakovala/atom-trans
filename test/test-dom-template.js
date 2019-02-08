/* jshint mocha: true */

const l = require('log').get('test');

const helper = require('./helper');
const assert = require('./assert/dom');

const dom = require('../lib/dom-util');

const test_html = `
<div id="container" class="clazz1 clazz2" attr="hello" data-attr="world">
	<h1>Title</h1>
	<ul>
		<li class="item">Item 1</li>
		<li class="item selected">Item 2</li>
		<li class="item">Item 3</li>
		<li class="item">Item 4</li>
	</ul>
</div>
`;

describe('DOM Util', () => {
	beforeEach(() => {
		document.body.innerHTML = test_html;
	});

	describe('#setElementValue', () => {
		it('should change nothing with unknown name', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '?', "Hello World!");
			assert(el.outerHTML).equal(test_html.trim());
		});

		it('should replace text', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '_', "Hello World!");
			assert(el.textContent).equal("Hello World!");
		});

		it('should replace inner html', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '$', "<p>Hello</p>");
			assert(el.innerHTML).equal("<p>Hello</p>");
		});

		it('should replace element id', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '#', "hello");
			assert(el.id).equal("hello");
		});

		it('should replace element class', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '.', 'hello world');
			assert(el.className).equal('hello world');
		});

		it('should replace attribute', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '.attr', "Test attr");
			assert(el.getAttribute('attr')).equal("Test attr");

			dom.setElementValue(el, '.data-attr', "Test data attr");
			assert(el.getAttribute('data-attr')).equal('Test data attr');
		});

		it('should remove attribute', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '.attr', undefined);
			assert(el.hasAttribute('attr')).isFalse();
		});

		it('should resolve value from callback function', () => {
			let el = helper.query('#container');

			dom.setElementValue(el, '#', (element, name, prev) => {
				assert(element).strictEqual(el);
				assert(name).equal('#');
				assert(prev).equal("container");

				return 'something';
			});
			assert(el.id).equal('something');
		});
	});

	describe('#updateElement', () => {
		it('should ignore falsify elements', () => {
			let el = null;

			dom.updateElement(el, { '#': "hello" });
		});

		it('should ignore non-object data', () => {
			let el = helper.query('#container');

			dom.updateElement(el, null);
		});

		it('should set specified properties', () => {
			let el = helper.query('#container');

			dom.updateElement(el, {
				'#': 'hello',
				'_': "world",
				'.attr_1': "attr-1",
				'.attr_2': "attr-2",
			});
			assert(el.id).equal('hello');
			assert(el.textContent).equal('world');
			assert(el.getAttribute('attr_1')).equal('attr-1');
			assert(el.getAttribute('attr_2')).equal('attr-2');
		});
	});

	describe('#updateElementAll', () => {
		it('should ignore falsify element', () => {
			let el = null;

			dom.updateElement(el, { '#container': { '_': "hello" }});
		});

		it('should ignore falsify data', () => {
			let el = helper.query('#container');

			dom.updateElement(el, null);
		});

		it('should set values of all elements', () => {
			let el = helper.query('#container');
			const el_title = helper.query('h1', el);

			dom.updateElementAll(el, {
				'&': { '.': '' },
				'h1': { '_': "Hello" },
			});

			assert(el.className).equal('');
			assert(el_title.textContent).equal('Hello');
		});

		it('should set values of all selector matches', () => {
			let el = helper.query('#container');

			dom.updateElementAll(el, {
				'li': { '_': 'hello' },
			});

			const items = helper.queryAll('li');
			assert(items).hasLength(4);
			items.forEach((item) => assert(item.textContent).equal('hello'));
		});

		it('should resolve value from callback for each element', () => {
			let el = helper.query('#container');

			dom.updateElementAll(el, {
				'li': {
					'#': (el, name, prev) => {
						return el.textContent;
					}
				}
			});

			const items = helper.queryAll('li');
			assert(items).hasLength(4);
			items.forEach(item => assert(item.id).equal(item.textContent));
		});
	});
});

