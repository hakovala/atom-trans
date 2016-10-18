"use strict";

const assert = require('./assert-dom');

const domUtil = require('../lib/dom-util');

describe('DOM Util', () => {

	it('has document', () => {
		assert.equal(document.body.tagName.toLowerCase(), 'body');
	});

	function testDocument(expected, method) {
		it(`should return ${expected} for Document`, () => {
			assert.equal(expected, method(document));
		});
	}

	function testElement(expected, method) {
		it(`should return ${expected} for Element`, () => {
			let element = document.createElement('div');
			assert.equal(expected, method(element));
		});
	}

	function testTextNode(expected, method) {
		it(`should return ${expected} for TextNode`, () => {
			let text = document.createTextNode('Hello World!');
			assert.equal(expected, method(text));
		});
	}

	function testDocumentFragment(expected, method) {
		it(`should return ${expected} for DocumentFragment`, () => {
			let fragment = document.createDocumentFragment();
			assert.equal(expected, method(fragment));
		});		
	}

	function testPrimitives(expected, method) {
		it(`should return ${expected} for JavaScript primitives`, () => {
			assert.equal(expected, method()); // undefined
			assert.equal(expected, method(null)); // null
			assert.equal(expected, method(false)); // false
			assert.equal(expected, method(true)); // true
			assert.equal(expected, method('hello')); // string
			assert.equal(expected, method(123)); // number
			assert.equal(expected, method({})) // plain object
			assert.equal(expected, method([])) // array
		});
	}

	describe('#isElement', () => {
		let method = domUtil.isElement;
		testDocument(false, method);
		testElement(true, method);
		testTextNode(false, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isDocument', () => {
		let method = domUtil.isDocument;
		testDocument(true, method);
		testElement(false, method);
		testTextNode(false, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isTextNode', () => {
		let method = domUtil.isTextNode;
		testDocument(false, method);
		testElement(false, method);
		testTextNode(true, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isDocumentFragment', () => {
		let method = domUtil.isDocumentFragment;
		testDocument(false, method);
		testElement(false, method);
		testTextNode(false, method);
		testDocumentFragment(true, method);
		testPrimitives(false, method);
	});

	describe('#isHTML', () => {
		it('should return true for HTML', () => {
			assert.ok(domUtil.isHTML('<div>'));
			assert.ok(domUtil.isHTML('<p id="foo">Hello World!</p>'));
			assert.ok(domUtil.isHTML('<p></p>'));
		});

		it('should return false for non-HTML', () => {
			assert.ok(!domUtil.isHTML('Hello World!'));
			assert.ok(!domUtil.isHTML('div'));
			assert.ok(!domUtil.isHTML('<div'));
			assert.ok(!domUtil.isHTML('div>'));
		});
	});

	describe('#query', () => {
		before(() => {
			document.body.innerHTML = `
				<div id="first">
					<div id="second">Hello World!</div>
				</div>`;
		});

		it('should return body Element', () => {
			assert.strictEqual(document.body, domUtil.query('body'));
		});

		it('should return head Element', () => {
			assert.strictEqual(document.head, domUtil.query('head'));			
		});

		it('should return correct Element', () => {
			let first = document.querySelector('div#first');
			assert.strictEqual(first, domUtil.query('div'));
			assert.strictEqual(first, domUtil.query('div#first'));

			let second = document.querySelector('div#second');
			assert.strictEqual(second, domUtil.query('div#second'));
			assert.strictEqual(second, domUtil.query('div', first));
		});
	});

	describe('#queryAll', () => {
		before(() => {
			document.body.innerHTML = `
				<ul id="list">
					<li id="item-1">Hello World!</div>
					<li id="item-2">Hello World!</div>
				</div>`;
		});

		it('should return Array', () => {
			let actual = domUtil.queryAll('body');
			assert(actual instanceof Array);
		});

		it('should return correct array of Elements', () => {
			let expected = document.querySelectorAll('li');
			let actual = domUtil.queryAll('li');

			for (let i = 0; i < expected.length; i++) {
				assert.strictEqual(expected[i], actual[i]);
			}
		});
	});

	describe('#matches', () => {
		let el = document.createElement('div');
		el.id = 'foo';

		it('should return false without selector', () => {
			assert.equal(false, domUtil.matches(el));
		});

		it('should return false for non-Elements', () => {
			assert.equal(false, domUtil.matches('hello', 'div'));
		});

		it('should return true for matching Element', () => {
			assert.equal(true, domUtil.matches(el, 'div#foo'));
		});

		it('should return false for non-matching Element', () => {
			assert.equal(false, domUtil.matches(el, 'div#bar'));
		});
	});

	describe('#filter', () => {
		let elements;
		before(() => {
			document.body.innerHTML = `
				<ul id="list">
					<li id="item-1">Hello World!</div>
					<li id="item-2">Hello World!</div>
				</div>`;
			elements = Array.prototype.slice.call(document.querySelectorAll('li'));
		});

		it('should return all elements without selector', () => {
			let actual = domUtil.filter(elements);
			assert.equal(elements.length, actual.length, 'should have all elements');
		});

		it('should return matching elements using selector', () => {
			let actual = domUtil.filter(elements, '#item-2');
			assert.equal(1, actual.length);
			assert.hasId(actual[0], 'item-2');
		});

		it('should return matching elements using callback', () => {
			let actual = domUtil.filter(elements, (el) => {
				return el.id == 'item-1';
			});
			assert.equal(1, actual.length);
			assert.hasId(actual[0], 'item-1');
		});
	});

	describe('#findParent', () => {
		before(() => {
			document.body.innerHTML = `
				<div id="depth-1">
					<div id="depth-2">
						<div id="depth-3">
							<div id="depth-4">
							</div>
						</div>
					</div>
				</div>`;
		});

		it('should return nearest matching parent', () => {
			let el = document.querySelector('#depth-4');
			let expected = document.querySelector('#depth-2');
			let actual = domUtil.findParent(el, '#depth-2');
			assert.strictEqual(expected, actual);
		});
		
		it('should return false if until is reached', () => {
			let el = document.querySelector('#depth-4');
			let actual = domUtil.findParent(el, '#depth-2', '#depth-3');
			assert.strictEqual(false, actual);
		});

		it('should return false if none found', () => {
			let el = document.querySelector('#depth-4');
			let actual = domUtil.findParent(el, 'foo');
			assert.strictEqual(false, actual);
		});

		it('should return null with non-element', () => {
			assert.strictEqual(null, domUtil.findParent(null, 'foo'));
		});
	});
});
