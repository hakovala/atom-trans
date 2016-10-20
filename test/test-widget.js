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
				<div id="child-3" class="child last"></div>
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
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			parent.prepend(child);
			let children = parent.el.children;
			assert.strictEqual(child.el, children[0]);
		});

		it('should prepend HTMLElement to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = element('li');

			parent.prepend(child);
			let children = parent.el.children;
			assert.strictEqual(child, children[0]);
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert.throws(() => { parent.prepend(); }, Error);
			assert.throws(() => { parent.prepend(true); }, Error);
			assert.throws(() => { parent.prepend(null); }, Error);
			assert.throws(() => { parent.prepend(123); }, Error);
			assert.throws(() => { parent.prepend('Hello'); }, Error);
			assert.throws(() => { parent.prepend({}); }, Error);
			assert.throws(() => { parent.prepend([]); }, Error);
		});
	});

	describe('#prependTo', () => {
		it('should prepend self to parent Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			child.prependTo(parent);
			let children = parent.el.children;
			assert.strictEqual(child.el, children[0]);
		});

		it('should prepend self to parent HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('li'));

			child.prependTo(parent);
			let children = parent.children;
			assert.strictEqual(child.el, children[0]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.prependTo(); }, Error);
			assert.throws(() => { child.prependTo(true); }, Error);
			assert.throws(() => { child.prependTo(null); }, Error);
			assert.throws(() => { child.prependTo(123); }, Error);
			assert.throws(() => { child.prependTo('Hello'); }, Error);
			assert.throws(() => { child.prependTo({}); }, Error);
			assert.throws(() => { child.prependTo([]); }, Error);
		});
	});

	describe('#insert', () => {
		it('should insert Widget to specific index', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('div'));

			parent.insert(2, child);
			let children = parent.el.children;
			assert.strictEqual(child.el, children[2]);
		});

		it('should insert HTMLElement to specific index', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(2, child);
			let children = parent.el.children;
			assert.strictEqual(child, children[2]);
		});

		it('should throw an error with invalid element', () => {
			let parent = new Widget(query('#parent'));

			assert.throws(() => { parent.insert(2); }, Error);
			assert.throws(() => { parent.insert(2, true); }, Error);
			assert.throws(() => { parent.insert(2, null); }, Error);
			assert.throws(() => { parent.insert(2, 123); }, Error);
			assert.throws(() => { parent.insert(2, 'Hello'); }, Error);
			assert.throws(() => { parent.insert(2, {}); }, Error);
			assert.throws(() => { parent.insert(2, []); }, Error);
		});

		it('should insert to first if index smaller than zero', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(-1, child);
			let children = parent.el.children;
			assert.strictEqual(child, children[0]);
		});

		it('should insert to last if index greater than children count', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(parent.el.children.length, child);
			let children = parent.el.children;
			assert.strictEqual(child, children[children.length - 1]);
		});
	});

	describe('#insertAfter', () => {
		it('should insert Widget after another Widget', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.insertAfter(other);
			let children = parent.children;
			assert.strictEqual(child.el, children[3]);
		});

		it('should insert Widget after another HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.insertAfter(other);
			let children = parent.children;
			assert.strictEqual(child.el, children[3]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.insertAfter(); }, Error);
			assert.throws(() => { child.insertAfter(true); }, Error);
			assert.throws(() => { child.insertAfter(null); }, Error);
			assert.throws(() => { child.insertAfter(123); }, Error);
			assert.throws(() => { child.insertAfter('Hello'); }, Error);
			assert.throws(() => { child.insertAfter({}); }, Error);
			assert.throws(() => { child.insertAfter([]); }, Error);
		});
	});

	describe('#insertBefore', () => {
		it('should insert Widget before another Widget', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.insertBefore(other);
			let children = parent.children;
			assert.strictEqual(child.el, children[2]);
		});

		it('should insert Widget before another HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.insertBefore(other);
			let children = parent.children;
			assert.strictEqual(child.el, children[2]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.insertBefore(); }, Error);
			assert.throws(() => { child.insertBefore(true); }, Error);
			assert.throws(() => { child.insertBefore(null); }, Error);
			assert.throws(() => { child.insertBefore(123); }, Error);
			assert.throws(() => { child.insertBefore('Hello'); }, Error);
			assert.throws(() => { child.insertBefore({}); }, Error);
			assert.throws(() => { child.insertBefore([]); }, Error);
		});
	});

	describe('#replace', () => {
		it('should replace Widget with self', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.replace(other);
			assert.strictEqual(child.el, parent.children[2]);
		});

		it('should replace HTMLElement with self', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.replace(other);
			assert.strictEqual(child.el, parent.children[2]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.replace(); }, Error);
			assert.throws(() => { child.replace(true); }, Error);
			assert.throws(() => { child.replace(null); }, Error);
			assert.throws(() => { child.replace(123); }, Error);
			assert.throws(() => { child.replace('Hello'); }, Error);
			assert.throws(() => { child.replace({}); }, Error);
			assert.throws(() => { child.replace([]); }, Error);
		});
	});

	describe('#replaceWith', () => {
		it('should replace self with Widget', () => {
			let parent = query('#parent');
			let child = new Widget(parent.children[2]);
			let other = new Widget(element('div'));

			child.replaceWith(other);
			assert.strictEqual(other.el, parent.children[2]);
		});

		it('should replace self with HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(parent.children[2]);
			let other = element('div');

			child.replaceWith(other);
			assert.strictEqual(other, parent.children[2]);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert.throws(() => { child.replaceWith(); }, Error);
			assert.throws(() => { child.replaceWith(true); }, Error);
			assert.throws(() => { child.replaceWith(null); }, Error);
			assert.throws(() => { child.replaceWith(123); }, Error);
			assert.throws(() => { child.replaceWith('Hello'); }, Error);
			assert.throws(() => { child.replaceWith({}); }, Error);
			assert.throws(() => { child.replaceWith([]); }, Error);
		});
	});

	describe('#find', () => {
		it('should return matching child elements', () => {
			let res;
			let body = new Widget(document.body);

			res = body.find('#parent');
			assert.equal(1, res.length);
			assert(res[0] instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(query('#parent'), res[0].el);

			res = body.find('.child');
			assert.equal(3, res.length);
		});

		it('should return empty set if no matching found', () => {
			let body = new Widget(document.body);

			let res = body.find('foo');
			assert.equal(0, res.length);
		});

		it('should throw error with invalid argument', () => {
			let body = new Widget(document.body);

			assert.throws(() => { body.find(); }, Error);
			assert.throws(() => { body.find(true); }, Error);
			assert.throws(() => { body.find(null); }, Error);
			assert.throws(() => { body.find(123); }, Error);
			assert.throws(() => { body.find({}); }, Error);
			assert.throws(() => { body.find([]); }, Error);
			assert.throws(() => { body.find(element('div')); }, Error);
			assert.throws(() => { body.find(new Widget(element('div'))); }, Error);
		});
	});

	describe('#first', () => {
		it('should return first child element', () => {
			let target = new Widget(query('#parent'));
			let first = target.first();
			assert(first instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(target.el.firstElementChild, first.el);
		});

		it('should return null if there is no child elements', () => {
			let target = new Widget(query('#child-1'));
			let first = target.first();
			assert.strictEqual(null, first);
		});
	});

	describe('#last', () => {
		it('should return last child element', () => {
			let target = new Widget(query('#parent'));
			let last = target.last();
			assert(last instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(target.el.lastElementChild, last.el);
		});

		it('should return null if there is no child elements', () => {
			let target = new Widget(query('#child-1'));
			let last = target.last();
			assert.strictEqual(null, last);
		});
	});

	describe('#next', () => {
		it('should return next element', () => {
			let item = new Widget(query('#child-1'));
			let next = item.next();
			assert(next instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(query('#child-2'), next.el);
		});

		it('should return next matching element', () => {
			let item = new Widget(query('#child-1'));
			let next = item.next('#child-3');
			assert(next instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(query('#child-3'), next.el);
		});

		it('should return null if there is no next', () => {
			let item = new Widget(query('#child-3'));
			assert.strictEqual(null, item.next());
		});

		it('should return null if there is no matching next', () => {
			let item = new Widget(query('#child-1'));
			assert.strictEqual(null, item.next('foo'));
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert.throws(() => { target.next(true); }, Error);
			assert.throws(() => { target.next(null); }, Error);
			assert.throws(() => { target.next(123); }, Error);
			assert.throws(() => { target.next({}); }, Error);
			assert.throws(() => { target.next([]); }, Error);
			assert.throws(() => { target.next(element('div')); }, Error);
			assert.throws(() => { target.next(new Widget(element('div'))); }, Error);
		});
	});

	describe('#nextAll', () => {
		it('should return all next elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[1]);
			let next = item.nextAll();

			for (let i = 2, l = 0; i < parent.children.length; i++, l++) {
				assert(next[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert.strictEqual(next[l].el, parent.children[i]);
			}
		});

		it('should return all matching next elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[1]);
			let next = item.nextAll('.last');

			for (let i = 2, l = 0; i < parent.children.length; i++) {
				if (!parent.children[i].matches('.last')) continue;
				assert(next[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert.strictEqual(next[l].el, parent.children[i]);
				l++;
			}
		});

		it('should return empty set if there is no next', () => {
			let item = new Widget(query('#child-3'));
			let next = item.nextAll();
			assert.equal(0, next.length);
		});

		it('shoud return empty set if there is no matching next', () => {
			let item = new Widget(query('#child-1'));
			let next = item.nextAll('foo');
			assert.equal(0, next.length);
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert.throws(() => { target.nextAll(true); }, Error);
			assert.throws(() => { target.nextAll(null); }, Error);
			assert.throws(() => { target.nextAll(123); }, Error);
			assert.throws(() => { target.nextAll({}); }, Error);
			assert.throws(() => { target.nextAll([]); }, Error);
			assert.throws(() => { target.nextAll(element('div')); }, Error);
			assert.throws(() => { target.nextAll(new Widget(element('div'))); }, Error);
		});
	});

	describe('#previous', () => {
		it('should return previous element', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previous();
			assert(prev instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(query('#child-1'), prev.el);
		});

		it('should return previous matching element', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previous('h1');
			assert(prev instanceof Widget, 'Expected to be instanceof Widget');
			assert.strictEqual(query('#title'), prev.el);
		});

		it('should return null if there is no previous', () => {
			let item = new Widget(query('#title'));
			assert.strictEqual(null, item.previous());
		});

		it('should return null if there is no matching previous', () => {
			let item = new Widget(query('#child-2'));
			assert.strictEqual(null, item.previous('foo'));
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert.throws(() => { target.previous(true); }, Error);
			assert.throws(() => { target.previous(null); }, Error);
			assert.throws(() => { target.previous(123); }, Error);
			assert.throws(() => { target.previous({}); }, Error);
			assert.throws(() => { target.previous([]); }, Error);
			assert.throws(() => { target.previous(element('div')); }, Error);
			assert.throws(() => { target.previous(new Widget(element('div'))); }, Error);
		});
	});

	describe('#previousAll', () => {
		it('should return all previous elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[3]);
			let prev = item.previousAll();
			// TODO: Assert WidgetList

			for (let i = 2, l = 0; i >= 0; i--, l++) {
				assert(prev[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert.strictEqual(prev[l].el, parent.children[i]);
			}
		});

		it('should return all matching previous elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[3]);
			let prev = item.previousAll('.child');
			// TODO: Assert WidgetList

			for (let i = 2, l = 0; i >= 0; i--) {
				if (!parent.children[i].matches('.child')) continue;
				assert(prev[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert.strictEqual(prev[l].el, parent.children[i]);
				l++;
			}
		});

		it('should return empty set if there is no previous', () => {
			let item = new Widget(query('#title'));
			let prev = item.previousAll();
			// TODO: Assert WidgetList
			assert.equal(0, prev.length);
		});

		it('should return empty set if there is no matching elements', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previousAll('foo');
			// TODO: Assert WidgetList
			assert.equal(0, prev.length);
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert.throws(() => { target.previousAll(true); }, Error);
			assert.throws(() => { target.previousAll(null); }, Error);
			assert.throws(() => { target.previousAll(123); }, Error);
			assert.throws(() => { target.previousAll({}); }, Error);
			assert.throws(() => { target.previousAll([]); }, Error);
			assert.throws(() => { target.previousAll(element('div')); }, Error);
			assert.throws(() => { target.previousAll(new Widget(element('div'))); }, Error);
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
