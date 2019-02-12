/* jshint mocha: true */
"use strict";

const l = require('log').get('test');

const helper = require('./helper');
const assert = require('./assert/dom');

const DomUtil = require('../lib/dom-util');

describe('DOM Util', () => {

	it('is static class', () => {
		function createDomUtil() {
			return new DomUtil();
		}
		assert(createDomUtil).throws(Error);
	});

	it('has document', () => {
		assert(document.body.tagName.toLowerCase()).equal('body');
	});

	function testDocument(expected, method) {
		it(`should return ${expected} for Document`, () => {
			assert(method(document)).is(expected);
		});
	}

	function testElement(expected, method) {
		it(`should return ${expected} for Element`, () => {
			let element = document.createElement('div');
			assert(method(element)).is(expected);
		});
	}

	function testTextNode(expected, method) {
		it(`should return ${expected} for TextNode`, () => {
			let text = document.createTextNode('Hello World!');
			assert(method(text)).is(expected);
		});
	}

	function testDocumentFragment(expected, method) {
		it(`should return ${expected} for DocumentFragment`, () => {
			let fragment = document.createDocumentFragment();
			assert(method(fragment)).is(expected);
		});
	}

	function testPrimitives(expected, method) {
		it(`should return ${expected} for JavaScript primitives`, () => {
			assert(method()).equal(expected); // undefined
			assert(method(null)).equal(expected); // null
			assert(method(false)).equal(expected); // false
			assert(method(true)).equal(expected); // true
			assert(method('hello')).equal(expected); // string
			assert(method(123)).equal(expected); // number
			assert(method({})).equal(expected); // plain object
			assert(method([])).equal(expected); // array
		});
	}

	describe('#isElement', () => {
		let method = DomUtil.isElement;
		testDocument(false, method);
		testElement(true, method);
		testTextNode(false, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isDocument', () => {
		let method = DomUtil.isDocument;
		testDocument(true, method);
		testElement(false, method);
		testTextNode(false, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isTextNode', () => {
		let method = DomUtil.isTextNode;
		testDocument(false, method);
		testElement(false, method);
		testTextNode(true, method);
		testDocumentFragment(false, method);
		testPrimitives(false, method);
	});

	describe('#isDocumentFragment', () => {
		let method = DomUtil.isDocumentFragment;
		testDocument(false, method);
		testElement(false, method);
		testTextNode(false, method);
		testDocumentFragment(true, method);
		testPrimitives(false, method);
	});

	describe('#isHTML', () => {
		it('should return true for HTML', () => {
			assert(DomUtil.isHTML('<div>')).ok();
			assert(DomUtil.isHTML('<p id="foo">Hello World!</p>')).ok();
			assert(DomUtil.isHTML('<p></p>')).ok();
		});

		it('should return false for non-HTML', () => {
			assert(!DomUtil.isHTML('Hello World!')).ok();
			assert(!DomUtil.isHTML('div')).ok();
			assert(!DomUtil.isHTML('<div')).ok();
			assert(!DomUtil.isHTML('div>')).ok();
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
			assert(DomUtil.query('body')).strictEqual(document.body);
		});

		it('should return head Element', () => {
			assert(DomUtil.query('head')).strictEqual(document.head);
		});

		it('should return correct Element', () => {
			let first = document.querySelector('div#first');
			assert(DomUtil.query('div')).strictEqual(first);
			assert(DomUtil.query('div#first')).strictEqual(first);

			let second = document.querySelector('div#second');
			assert(DomUtil.query('div#second')).strictEqual(second);
			assert(DomUtil.query('div', first)).strictEqual(second);
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
			let actual = DomUtil.queryAll('body');
			assert(actual).instanceOf(Array);
		});

		it('should return correct array of Elements', () => {
			let expected = document.querySelectorAll('li');
			let actual = DomUtil.queryAll('li');

			for (let i = 0; i < expected.length; i++) {
				assert(actual[i]).strictEqual(expected[i]);
			}
		});
	});

	describe('#matches', () => {
		let el = document.createElement('div');
		el.id = 'foo';

		it('should return false without selector', () => {
			assert(DomUtil.matches(el)).isFalse();
		});

		it('should return false for non-Elements', () => {
			assert(DomUtil.matches('hello', 'div')).isFalse();
		});

		it('should return true for matching Element', () => {
			assert(DomUtil.matches(el, 'div#foo')).isTrue();
		});

		it('should return false for non-matching Element', () => {
			assert(DomUtil.matches(el, 'div#bar')).isFalse();
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
			let actual = DomUtil.filter(elements);
			assert(actual).hasLength(elements.length, 'should have all elements');
		});

		it('should return matching elements using selector', () => {
			let actual = DomUtil.filter(elements, '#item-2');
			assert(actual).hasLength(1);
			assert(actual[0]).hasId('item-2');
		});

		it('should return matching elements using callback', () => {
			let actual = DomUtil.filter(elements, (el) => {
				return el.id == 'item-1';
			});
			assert(actual).hasLength(1);
			assert(actual[0]).hasId('item-1');
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
			let actual = DomUtil.findParent(el, '#depth-2');
			assert(actual).strictEqual(expected);
		});

		it('should return false if until is reached', () => {
			let el = document.querySelector('#depth-4');
			let actual = DomUtil.findParent(el, '#depth-2', '#depth-3');
			assert(actual).isFalse();
		});

		it('should return false if none found', () => {
			let el = document.querySelector('#depth-4');
			let actual = DomUtil.findParent(el, 'foo');
			assert(actual).isFalse();
		});

		it('should return null with non-element', () => {
			let actual = DomUtil.findParent(null, 'foo');
			assert(actual).isNull();
		});
	});

	describe('#create', () => {
		it('should create elements', () =>  {
			let el = DomUtil.create('#title.hello.world', "Hello World!");

			assert(el.id).equal('title');
			assert(el.className).equal('hello world');
			assert(el.textContent).equal('Hello World!');
		});
	});
});
