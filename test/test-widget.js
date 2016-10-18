"use strict";

const assert = require('./assert-dom');

const Widget = require('../lib/widget');

describe('Widget', () => {

	describe('constructor', () => {
		it('should have no Element', () => {
			let widget = new Widget();
			assert.equal(undefined, widget.el);
		});

		it('should have given Element', () => {
			let el = document.createElement('div');
			let widget = new Widget(el);
			assert.strictEqual(el, widget.el);
		});


		it('should create instance of Widget', () => {
			assert((new Widget()) instanceof Widget);
			assert((Widget()) instanceof Widget);
		});

	});

	describe('#append', () => {
		let widget;

		before(() => {
			widget = new Widget();
		});

		it('should append child', () =>  {
			//widget.append();
		});
	});
});
