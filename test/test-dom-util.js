"use strict";

const assert = require('assert');

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
});
