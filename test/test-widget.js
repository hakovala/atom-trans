"use strict";

const assert = require('./assert-dom');

const Widget = require('../lib/widget');

describe('Widget', () => {
	let div;

	// create element with given tag, id and class
	function element(tag, id, classes) {
		let el = document.createElement(tag || 'div');
		el.id = id;
		el.className = classes;
		return el;
	}

	// query element with selector from parent
	function query(selector, parent) {
		parent = parent || document;
		return parent.querySelector(selector);
	}

	// convert a array-like object to array
	function toArray(list) {
		return [].slice.call(list);
	}

	beforeEach(() => {
		// ensure that we have a clean Element to play with
		div = element();
		// also that we have clean test content in 'document.body'
		document.body.innerHTML = `
			<div id="parent">
				<div id="child-1"></div>
				<div id="child-1"></div>
				<div id="child-1"></div>
			</div>
		`;
	});

	describe('constructor', () => {
		it('should throw an Error without element', () => {
			assert.throws(() => {
				let widget = new Widget();
			}, Error, 'Expected "not an element" error.');
		});

		it('should have given Element', () => {
			let widget = new Widget(div);
			assert.strictEqual(div, widget.el);
		});

		it('should create instance of Widget', () => {
			assert((new Widget(div)) instanceof Widget);
			assert((Widget(div)) instanceof Widget);
		});

		it('should have read-only element', () => {
			let widget = new Widget(div);
			assert.throws(() => { widget.el = element(); }, TypeError);
		});
	});

	describe('#append', () => {
	});
});
