"use strict";

const helper = require('./helper');
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

	function contains(selector, parent) {
		return query(selector, parent) !== null;
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
			<div id="parent" class="parent">
				<h1 id="title">Hello, Title!</h1>
				<div id="child-1" class="child"></div>
				<div id="child-2" class="child"></div>
				<div id="child-3" class="child"></div>
			</div>
			<p id="other">Hello, Other!</p>
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

	describe('#remove', () => {
		it('should remove child using Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(query('#child-1'));

			parent.remove(child);
			assert.equal(false, parent.el.contains(child.el), 'Child was not removed');
		});

		it('should remove child using HTMLElement', () => {
			let parent = new Widget(query('#parent'));
			let child = query('#child-1');

			parent.remove(child);
			assert.equal(false, parent.el.contains(child.el), 'Child was not removed');
		});

		it('should remove child using selector', () => {
			let parent = new Widget(query('#parent'));

			assert.equal(4, parent.el.children.length, 'Failed pre-test child count check');

			parent.remove('#child-1');
			assert.equal(3, parent.el.children.length);
			assert.equal(false, contains('#child-1', parent.el));

			parent.remove('.child');
			assert.equal(1, parent.el.children.length);
			assert.equal(true, contains('#title', parent.el));
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert.throws(() => { parent.remove(); }, Error);
			assert.throws(() => { parent.remove(null); }, Error);
			assert.throws(() => { parent.remove(123); }, Error);
			assert.throws(() => { parent.remove(function() {}); }, Error);
			assert.throws(() => { parent.remove({}); }, Error);
			assert.throws(() => { parent.remove([]); }, Error);
		});
	});

	describe('#detach', () => {
		it('should detach itself from parent', () => {
			let parent = query('#parent');
			let child = query('#child-2');

			let widget = new Widget(child);
			widget.detach();
			assert.equal(false, parent.contains(child));
		});
	});

	describe('#append', () => {
		it('should append Widget to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			parent.append(child);
			let children = parent.el.children;
			assert.strictEqual(child.el, children[children.length - 1]);
		});

		it('should append HTMLElement to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = element('li');

			parent.append(child);
			let children = parent.el.children;
			assert.strictEqual(child, children[children.length - 1]);
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert.throws(() => { parent.append(); }, Error);
			assert.throws(() => { parent.append(true); }, Error);
			assert.throws(() => { parent.append(null); }, Error);
			assert.throws(() => { parent.append(123); }, Error);
			assert.throws(() => { parent.append('Hello'); }, Error);
			assert.throws(() => { parent.append({}); }, Error);
			assert.throws(() => { parent.append([]); }, Error);
		});
	});

	describe('#appendTo', () => {
		it('should append self to parent Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			child.appendTo(parent);
			let children = parent.el.children;
			assert.strictEqual(child.el, children[children.length - 1]);
		});

		it('should append self to parent HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('li'));

			child.appendTo(parent);
			let children = parent.children;
			assert.strictEqual(child.el, children[children.length - 1]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.appendTo(); }, Error);
			assert.throws(() => { child.appendTo(true); }, Error);
			assert.throws(() => { child.appendTo(null); }, Error);
			assert.throws(() => { child.appendTo(123); }, Error);
			assert.throws(() => { child.appendTo('Hello'); }, Error);
			assert.throws(() => { child.appendTo({}); }, Error);
			assert.throws(() => { child.appendTo([]); }, Error);
		});
	});

	describe('#prepend', () => {
		it('should prepend Widget to parent', () => {

		});

		it('should prepend HTMLElement to parent', () => {

		});
	});

	describe('#prependTo', () => {
		it('should prepend self to parent Widget', () => {

		});

		it('should prepend self to parent HTMLElement', () => {

		});
	});

	describe('#insert', () => {
		it('should insert Widget to specific index', () => {

		});
	});

	describe('#insertAfter', () => {
		it('should insert Widget after another Widget', () => {

		});

		it('should insert Widget after another HTMLElement', () => {

		});
	});

	describe('#insertBefore', () => {
		it('should insert Widget before another Widget', () => {

		});

		it('should insert Widget before another HTMLElement', () => {

		});
	});

	describe('#replace', () => {
		it('should replace Widget with self', () => {

		});

		it('should replace HTMLElement with self', () => {

		});
	});

	describe('#replaceWith', () => {
		it('should replace self with Widget', () => {

		});

		it('should replace self with HTMLElement', () => {

		});
	});

	describe('#find', () => {
		it('should return matching child elements', () => {

		});
	});

	describe('#first', () => {
		it('should return first child element', () => {

		});

		it('should return null if there is no child elements', () => {

		});
	});

	describe('#last', () => {
		it('should return last child element', () => {

		});

		it('should return null if there is no child elements', () => {

		});
	});

	describe('#next', () => {
		it('should return next element', () => {

		});

		it('should return next matching element', () => {

		});

		it('should return null if there is no next', () => {

		});
	});

	describe('#nextAll', () => {
		it('should return all next elements', () => {

		});

		it('should return all matching next elements', () => {

		});

		it('should return empty set if there is no next', () => {

		});
	});

	describe('#previous', () => {
		it('should return previous element', () => {

		});

		it('should return previous matching element', () => {

		});

		it('should return null if there is no previous', () => {

		});
	});

	describe('#previousAll', () => {
		it('should return all previous elements', () => {

		});

		it('should return all matching previous elements', () => {

		});

		it('should return empty set if there is no previous', () => {

		});
	});

	describe('#matches', () => {
		it('should return whether this matches the selector', () => {

		});
	});

	describe('#parent', () => {
		it('should return parent', () => {

		});

		it('should return null if there is no parent', () => {

		});

		it('should return parent that matches selector', () => {

		});

		it('should return null if no parent matches the selector', () => {

		});
	});

	describe('#parents', () => {
		it('should return all parents', () => {

		});

		it('should return empty set if there is no parents', () => {

		});

		it('should return all matching parents', () => {

		});
	});

	describe('#children', () => {
		it('should return all children', () => {

		});

		it('should return all matching children', () => {

		});
	});

	describe('#siblings', () => {
		it('should return all siblings', () => {

		});

		it('should return all matching siblings', () => {

		});
	});

	describe('#closest', () => {
		it('should return self without selector', () => {

		});

		it('should return closest matching element', () => {

		});
	});
});
