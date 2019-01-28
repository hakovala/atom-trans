/* jshint mocha: true */
"use strict";

const helper = require('./helper');
const assert = require('./assert/dom');

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

	describe('static #query', () => {
		it('should return widget', () => {
			let widget = Widget.query('#title');
			assert(widget.el).strictEqual(query('#title'));
		});
		it('should return null for no-matches', () => {
			let widget = Widget.query('#NONE');
			assert(widget).strictEqual(null);
		});
		it('should query from HTMLElement parent', () => {
			let widget = Widget.query('div', query('#parent'));
			assert(widget.el).strictEqual(query('#child-1'));
		});
		it('should query from Widget parent', () => {
			let widget = Widget.query('div', new Widget(query('#parent')));
			assert(widget.el).strictEqual(query('#child-1'));
		});
	});

	describe('static #queryAll', () => {
		it('should return Array of widgets', () => {
			let res = Widget.queryAll('#parent');
			assert(res).hasLength(1);
			assert(res[0]).instanceOf(Widget, 'Expected to be instance of Widget');
			assert(res[0].el).strictEqual(query('#parent'));
		});
		it('should query from HTMLElement parent', () => {
			let res = Widget.queryAll('div', query('#parent'));
			assert(res).hasLength(3);
			assert(res[0].el).strictEqual(query('#child-1'));
		});
		it('should query from Widget parent', () => {
			let res = Widget.queryAll('div', new Widget(query('#parent')));
			assert(res).hasLength(3);
			assert(res[0].el).strictEqual(query('#child-1'));
		});
		it('should return empty set if no matching found', () => {
			let res = Widget.queryAll('foo');
			assert(res).hasLength(0);
		});
	});

	describe('constructor', () => {
		it('should throw an Error without element', () => {
			assert(() => {
				let widget = new Widget();
			}).throws(Error, 'Expected "not an element" error.');
		});

		it('should have given Element', () => {
			let widget = new Widget(div);
			assert(widget.el).strictEqual(div);
		});

		it('should create instance of Widget', () => {
			assert((new Widget(div)) instanceof Widget);
		});

		it('should have read-only element', () => {
			let widget = new Widget(div);
			assert(() => { widget.el = element(); }).throws(TypeError);
		});

		it('should clone existing Widget', () => {
			let other = new Widget(div);
			let widget = new Widget(other);

			assert(widget.el).strictEqual(other.el);
			assert(widget).notStrictEqual(other);
		});
	});

	describe('#remove', () => {
		it('should remove child using Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(query('#child-1'));

			parent.remove(child);
			assert(parent.el.contains(child.el)).isFalse('Child was not removed');
		});

		it('should remove child using HTMLElement', () => {
			let parent = new Widget(query('#parent'));
			let child = query('#child-1');

			parent.remove(child);
			assert(parent.el.contains(child.el)).isFalse('Child was not removed');
		});

		it('should remove child using selector', () => {
			let parent = new Widget(query('#parent'));

			assert(parent.el).hasChildCount(4, 'Failed pre-test child count check');

			parent.remove('#child-1');
			assert(parent.el).hasChildCount(3);
			assert(contains('#child-1', parent.el)).isFalse();

			parent.remove('.child');
			assert(parent.el).hasChildCount(1);
			assert(contains('#title', parent.el));
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert(() => { parent.remove(); }).throws(Error);
			assert(() => { parent.remove(null); }).throws(Error);
			assert(() => { parent.remove(123); }).throws(Error);
			assert(() => { parent.remove(function() {}); }).throws(Error);
			assert(() => { parent.remove({}); }).throws(Error);
			assert(() => { parent.remove([]); }).throws(Error);
		});
	});

	describe('#detach', () => {
		it('should detach itself from parent', () => {
			let parent = query('#parent');
			let child = query('#child-2');

			let widget = new Widget(child);
			widget.detach();
			assert(parent.contains(child)).isFalse();
		});
	});

	describe('#append', () => {
		it('should append Widget to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			parent.append(child);
			let children = parent.el.children;
			assert(children[children.length - 1]).strictEqual(child.el);
		});

		it('should append HTMLElement to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = element('li');

			parent.append(child);
			let children = parent.el.children;
			assert(children[children.length - 1]).strictEqual(child);
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert(() => { parent.append(); }).throws(Error);
			assert(() => { parent.append(true); }).throws(Error);
			assert(() => { parent.append(null); }).throws(Error);
			assert(() => { parent.append(123); }).throws(Error);
			assert(() => { parent.append('Hello'); }).throws(Error);
			assert(() => { parent.append({}); }).throws(Error);
			assert(() => { parent.append([]); }).throws(Error);
		});
	});

	describe('#appendTo', () => {
		it('should append self to parent Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			child.appendTo(parent);
			let children = parent.el.children;
			assert(children[children.length - 1]).strictEqual(child.el);
		});

		it('should append self to parent HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('li'));

			child.appendTo(parent);
			let children = parent.children;
			assert(children[children.length - 1]).strictEqual(child.el);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.appendTo(); }).throws(Error);
			assert(() => { child.appendTo(true); }).throws(Error);
			assert(() => { child.appendTo(null); }).throws(Error);
			assert(() => { child.appendTo(123); }).throws(Error);
			assert(() => { child.appendTo('Hello'); }).throws(Error);
			assert(() => { child.appendTo({}); }).throws(Error);
			assert(() => { child.appendTo([]); }).throws(Error);
		});
	});

	describe('#prepend', () => {
		it('should prepend Widget to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			parent.prepend(child);
			let children = parent.el.children;
			assert(children[0]).strictEqual(child.el);
		});

		it('should prepend HTMLElement to parent', () => {
			let parent = new Widget(query('#parent'));
			let child = element('li');

			parent.prepend(child);
			let children = parent.el.children;
			assert(children[0]).strictEqual(child);
		});

		it('should throw an error with invalid argument', () => {
			let parent = new Widget(query('#parent'));

			assert(() => { parent.prepend(); }).throws(Error);
			assert(() => { parent.prepend(true); }).throws(Error);
			assert(() => { parent.prepend(null); }).throws(Error);
			assert(() => { parent.prepend(123); }).throws(Error);
			assert(() => { parent.prepend('Hello'); }).throws(Error);
			assert(() => { parent.prepend({}); }).throws(Error);
			assert(() => { parent.prepend([]); }).throws(Error);
		});
	});

	describe('#prependTo', () => {
		it('should prepend self to parent Widget', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('li'));

			child.prependTo(parent);
			let children = parent.el.children;
			assert(children[0]).strictEqual(child.el);
		});

		it('should prepend self to parent HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('li'));

			child.prependTo(parent);
			let children = parent.children;
			assert(children[0]).strictEqual(child.el);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.prependTo(); }).throws(Error);
			assert(() => { child.prependTo(true); }).throws(Error);
			assert(() => { child.prependTo(null); }).throws(Error);
			assert(() => { child.prependTo(123); }).throws(Error);
			assert(() => { child.prependTo('Hello'); }).throws(Error);
			assert(() => { child.prependTo({}); }).throws(Error);
			assert(() => { child.prependTo([]); }).throws(Error);
		});
	});

	describe('#insert', () => {
		it('should insert Widget to specific index', () => {
			let parent = new Widget(query('#parent'));
			let child = new Widget(element('div'));

			parent.insert(2, child);
			let children = parent.el.children;
			assert(children[2]).strictEqual(child.el);
		});

		it('should insert HTMLElement to specific index', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(2, child);
			let children = parent.el.children;
			assert(children[2]).strictEqual(child);
		});

		it('should throw an error with invalid element', () => {
			let parent = new Widget(query('#parent'));

			assert(() => { parent.insert(2); }).throws(Error);
			assert(() => { parent.insert(2, true); }).throws(Error);
			assert(() => { parent.insert(2, null); }).throws(Error);
			assert(() => { parent.insert(2, 123); }).throws(Error);
			assert(() => { parent.insert(2, 'Hello'); }).throws(Error);
			assert(() => { parent.insert(2, {}); }).throws(Error);
			assert(() => { parent.insert(2, []); }).throws(Error);
		});

		it('should insert to first if index smaller than zero', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(-1, child);
			let children = parent.el.children;
			assert(children[0]).strictEqual(child);
		});

		it('should insert to last if index greater than children count', () => {
			let parent = new Widget(query('#parent'));
			let child = element('div');

			parent.insert(parent.el.children.length, child);
			let children = parent.el.children;
			assert(children[children.length - 1]).strictEqual(child);
		});
	});

	describe('#insertAfter', () => {
		it('should insert Widget after another Widget', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.insertAfter(other);
			let children = parent.children;
			assert(children[3]).strictEqual(child.el);
		});

		it('should insert Widget after another HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.insertAfter(other);
			let children = parent.children;
			assert(children[3]).strictEqual(child.el);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.insertAfter(); }).throws(Error);
			assert(() => { child.insertAfter(true); }).throws(Error);
			assert(() => { child.insertAfter(null); }).throws(Error);
			assert(() => { child.insertAfter(123); }).throws(Error);
			assert(() => { child.insertAfter('Hello'); }).throws(Error);
			assert(() => { child.insertAfter({}); }).throws(Error);
			assert(() => { child.insertAfter([]); }).throws(Error);
		});
	});

	describe('#insertBefore', () => {
		it('should insert Widget before another Widget', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.insertBefore(other);
			let children = parent.children;
			assert(children[2]).strictEqual(child.el);
		});

		it('should insert Widget before another HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.insertBefore(other);
			let children = parent.children;
			assert(children[2]).strictEqual(child.el);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.insertBefore(); }).throws(Error);
			assert(() => { child.insertBefore(true); }).throws(Error);
			assert(() => { child.insertBefore(null); }).throws(Error);
			assert(() => { child.insertBefore(123); }).throws(Error);
			assert(() => { child.insertBefore('Hello'); }).throws(Error);
			assert(() => { child.insertBefore({}); }).throws(Error);
			assert(() => { child.insertBefore([]); }).throws(Error);
		});
	});

	describe('#replace', () => {
		it('should replace Widget with self', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = new Widget(parent.children[2]);

			child.replace(other);
			assert(parent.children[2]).strictEqual(child.el);
		});

		it('should replace HTMLElement with self', () => {
			let parent = query('#parent');
			let child = new Widget(element('div'));
			let other = parent.children[2];

			child.replace(other);
			assert(parent.children[2]).strictEqual(child.el);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.replace(); }).throws(Error);
			assert(() => { child.replace(true); }).throws(Error);
			assert(() => { child.replace(null); }).throws(Error);
			assert(() => { child.replace(123); }).throws(Error);
			assert(() => { child.replace('Hello'); }).throws(Error);
			assert(() => { child.replace({}); }).throws(Error);
			assert(() => { child.replace([]); }).throws(Error);
		});
	});

	describe('#replaceWith', () => {
		it('should replace self with Widget', () => {
			let parent = query('#parent');
			let child = new Widget(parent.children[2]);
			let other = new Widget(element('div'));

			child.replaceWith(other);
			assert(parent.children[2]).strictEqual(other.el);
		});

		it('should replace self with HTMLElement', () => {
			let parent = query('#parent');
			let child = new Widget(parent.children[2]);
			let other = element('div');

			child.replaceWith(other);
			assert(parent.children[2]).strictEqual(other);
		});

		it('should throw an error with invalid argument', () => {
			let child = new Widget(element('li'));

			assert(() => { child.replaceWith(); }).throws(Error);
			assert(() => { child.replaceWith(true); }).throws(Error);
			assert(() => { child.replaceWith(null); }).throws(Error);
			assert(() => { child.replaceWith(123); }).throws(Error);
			assert(() => { child.replaceWith('Hello'); }).throws(Error);
			assert(() => { child.replaceWith({}); }).throws(Error);
			assert(() => { child.replaceWith([]); }).throws(Error);
		});
	});

	describe('#find', () => {
		it('should return matching child elements', () => {
			let res;
			let body = new Widget(document.body);

			res = body.find('#parent');
			assert(res).hasLength(1);
			assert(res[0]).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(res[0].el).strictEqual(query('#parent'));

			res = body.find('.child');
			assert(res).hasLength(3);
		});

		it('should return empty set if no matching found', () => {
			let body = new Widget(document.body);

			let res = body.find('foo');
			assert(res).hasLength(0);
		});

		it('should throw error with invalid argument', () => {
			let body = new Widget(document.body);

			assert(() => { body.find(); }).throws(Error);
			assert(() => { body.find(true); }).throws(Error);
			assert(() => { body.find(null); }).throws(Error);
			assert(() => { body.find(123); }).throws(Error);
			assert(() => { body.find({}); }).throws(Error);
			assert(() => { body.find([]); }).throws(Error);
			assert(() => { body.find(element('div')); }).throws(Error);
			assert(() => { body.find(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#first', () => {
		it('should return first child element', () => {
			let target = new Widget(query('#parent'));
			let first = target.first();
			assert(first).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(first.el).strictEqual(target.el.firstElementChild);
		});

		it('should return null if there is no child elements', () => {
			let target = new Widget(query('#child-1'));
			let first = target.first();
			assert(first).isNull();
		});
	});

	describe('#last', () => {
		it('should return last child element', () => {
			let target = new Widget(query('#parent'));
			let last = target.last();
			assert(last).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(last.el).strictEqual(target.el.lastElementChild);
		});

		it('should return null if there is no child elements', () => {
			let target = new Widget(query('#child-1'));
			let last = target.last();
			assert(last).isNull();
		});
	});

	describe('#next', () => {
		it('should return next element', () => {
			let item = new Widget(query('#child-1'));
			let next = item.next();
			assert(next).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(next.el).strictEqual(query('#child-2'));
		});

		it('should return next matching element', () => {
			let item = new Widget(query('#child-1'));
			let next = item.next('#child-3');
			assert(next).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(next.el).strictEqual(query('#child-3'));
		});

		it('should return null if there is no next', () => {
			let item = new Widget(query('#child-3'));
			assert(item.next()).isNull();
		});

		it('should return null if there is no matching next', () => {
			let item = new Widget(query('#child-1'));
			assert(item.next('foo')).isNull();
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.next(true); }).throws(Error);
			assert(() => { target.next(null); }).throws(Error);
			assert(() => { target.next(123); }).throws(Error);
			assert(() => { target.next({}); }).throws(Error);
			assert(() => { target.next([]); }).throws(Error);
			assert(() => { target.next(element('div')); }).throws(Error);
			assert(() => { target.next(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#nextAll', () => {
		it('should return all next elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[1]);
			let next = item.nextAll();

			for (let i = 2, l = 0; i < parent.children.length; i++, l++) {
				assert(next[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert(parent.children[i]).strictEqual(next[l].el);
			}
		});

		it('should return all matching next elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[1]);
			let next = item.nextAll('.last');

			for (let i = 2, l = 0; i < parent.children.length; i++) {
				if (!parent.children[i].matches('.last')) { continue; }
				assert(next[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert(parent.children[i]).strictEqual(next[l].el);
				l++;
			}
		});

		it('should return empty set if there is no next', () => {
			let item = new Widget(query('#child-3'));
			let next = item.nextAll();
			assert(next).hasLength(0);
		});

		it('shoud return empty set if there is no matching next', () => {
			let item = new Widget(query('#child-1'));
			let next = item.nextAll('foo');
			assert(next).hasLength(0);
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.nextAll(true); }).throws(Error);
			assert(() => { target.nextAll(null); }).throws(Error);
			assert(() => { target.nextAll(123); }).throws(Error);
			assert(() => { target.nextAll({}); }).throws(Error);
			assert(() => { target.nextAll([]); }).throws(Error);
			assert(() => { target.nextAll(element('div')); }).throws(Error);
			assert(() => { target.nextAll(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#previous', () => {
		it('should return previous element', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previous();
			assert(prev).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(prev.el).strictEqual(query('#child-1'));
		});

		it('should return previous matching element', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previous('h1');
			assert(prev).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(prev.el).strictEqual(query('#title'));
		});

		it('should return null if there is no previous', () => {
			let item = new Widget(query('#title'));
			assert(item.previous()).isNull();
		});

		it('should return null if there is no matching previous', () => {
			let item = new Widget(query('#child-2'));
			assert(item.previous('foo')).isNull();
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.previous(true); }).throws(Error);
			assert(() => { target.previous(null); }).throws(Error);
			assert(() => { target.previous(123); }).throws(Error);
			assert(() => { target.previous({}); }).throws(Error);
			assert(() => { target.previous([]); }).throws(Error);
			assert(() => { target.previous(element('div')); }).throws(Error);
			assert(() => { target.previous(new Widget(element('div'))); }).throws(Error);
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
				assert(parent.children[i]).strictEqual(prev[l].el);
			}
		});

		it('should return all matching previous elements', () => {
			let parent = query('#parent');
			let item = new Widget(parent.children[3]);
			let prev = item.previousAll('.child');
			// TODO: Assert WidgetList

			for (let i = 2, l = 0; i >= 0; i--) {
				if (!parent.children[i].matches('.child')) { continue; }
				assert(prev[l] instanceof Widget, 'Expected to be instanceof Widget');
				assert(parent.children[i]).strictEqual(prev[l].el);
				l++;
			}
		});

		it('should return empty set if there is no previous', () => {
			let item = new Widget(query('#title'));
			let prev = item.previousAll();
			// TODO: Assert WidgetList
			assert(prev).hasLength(0);
		});

		it('should return empty set if there is no matching elements', () => {
			let item = new Widget(query('#child-2'));
			let prev = item.previousAll('foo');
			// TODO: Assert WidgetList
			assert(prev).hasLength(0);
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.previousAll(true); }).throws(Error);
			assert(() => { target.previousAll(null); }).throws(Error);
			assert(() => { target.previousAll(123); }).throws(Error);
			assert(() => { target.previousAll({}); }).throws(Error);
			assert(() => { target.previousAll([]); }).throws(Error);
			assert(() => { target.previousAll(element('div')); }).throws(Error);
			assert(() => { target.previousAll(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#matches', () => {
		it('should return true if this matches the selector', () => {
			let item = new Widget(element('div', 'title', 'item'));
			assert(item.matches('div')).isTrue();
			assert(item.matches('#title')).isTrue();
			assert(item.matches('.item')).isTrue();
			assert(item.matches('#title.item')).isTrue();
		});

		it('should return false if this doesn\'t match the selector', () => {
			let item = new Widget(element('div', 'title', 'item'));
			assert(item.matches('foo')).isFalse();
			assert(item.matches('#bar')).isFalse();
			assert(item.matches('.baz')).isFalse();
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.matches(); }).throws(Error);
			assert(() => { target.matches(true); }).throws(Error);
			assert(() => { target.matches(null); }).throws(Error);
			assert(() => { target.matches(123); }).throws(Error);
			assert(() => { target.matches({}); }).throws(Error);
			assert(() => { target.matches([]); }).throws(Error);
			assert(() => { target.matches(element('div')); }).throws(Error);
			assert(() => { target.matches(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#parent', () => {
		it('should return parent', () => {
			let parent = query('#parent');
			let child = new Widget(query('#child-1'));

			let res = child.parent();
			assert(res).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(res.el).strictEqual(parent);
		});

		it('should return null if there is no parent', () => {
			let target = new Widget(element('div'));

			assert(target.parent()).isNull();
		});

		it('should return parent that matches selector', () => {
			let target = new Widget(query('#child-1'));

			let res = target.parent('body');
			assert(res).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(res.el).strictEqual(document.body);
		});

		it('should return null if no parent matches the selector', () => {
			let target = new Widget(query('#child-1'));

			assert(target.parent('foo')).isNull();
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.parent(true); }).throws(Error);
			assert(() => { target.parent(null); }).throws(Error);
			assert(() => { target.parent(123); }).throws(Error);
			assert(() => { target.parent({}); }).throws(Error);
			assert(() => { target.parent([]); }).throws(Error);
			assert(() => { target.parent(element('div')); }).throws(Error);
			assert(() => { target.parent(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#parentAll', () => {

		// helper method to get parent elements, with or without selector
		function getParents(el, selector) {
			let res = [];
			let parent = el;
			while ((parent = parent.parentNode) && parent instanceof HTMLElement) {
				if (!selector || parent.matches(selector)) {
					res.push(parent);
				}
			}
			return res;
		}

		it('should return all parents', () => {
			let target = new Widget(query('#child-1'));

			let expected = getParents(query('#child-1'));
			let actual = target.parentAll();

			// TODO: assert instanceof WidgetList
			assert(actual).hasLength(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i] instanceof Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should return empty set if there is no parents', () => {
			let target = new Widget(element('div'));

			// TODO: assert instanceof WidgetList
			assert(target.parentAll()).hasLength(0);
		});

		it('should return all matching parents', () => {
			let target = new Widget(query('#child-1'));

			let expected = getParents(query('#child-1'), 'body');
			let actual = target.parentAll('body');

			// TODO: assert instanceof WidgetList
			assert(actual).hasLength(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i] instanceof Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.parentAll(true); }).throws(Error);
			assert(() => { target.parentAll(null); }).throws(Error);
			assert(() => { target.parentAll(123); }).throws(Error);
			assert(() => { target.parentAll({}); }).throws(Error);
			assert(() => { target.parentAll([]); }).throws(Error);
			assert(() => { target.parentAll(element('div')); }).throws(Error);
			assert(() => { target.parentAll(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#children', () => {
		it('should return all children', () => {
			let target = new Widget(query('#parent'));

			let expected = target.el.children;
			let actual = target.children();

			assert(actual.length).equal(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i]).instanceOf(Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should return all matching children', () => {
			let target = new Widget(query('#parent'));

			let expected = Array.from(target.el.children).filter((e) => e.matches('.child'));
			let actual = target.children('.child');

			assert(actual.length).equal(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i] instanceof Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.children(true); }).throws(Error);
			assert(() => { target.children(null); }).throws(Error);
			assert(() => { target.children(123); }).throws(Error);
			assert(() => { target.children({}); }).throws(Error);
			assert(() => { target.children([]); }).throws(Error);
			assert(() => { target.children(element('div')); }).throws(Error);
			assert(() => { target.children(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#siblings', () => {
		it('should return all siblings', () => {
			let parent = query('#parent');
			let target = new Widget(query('#child-2'));

			let expected = Array.from(parent.children).filter((e) => e !== target.el);
			let actual = target.siblings();

			assert(actual.length).equal(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i]).instanceOf(Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should return all matching siblings', () => {
			let parent = query('#parent');
			let target = new Widget(query('#child-2'));

			let expected = Array.from(parent.children).filter((e) => e !== target.el).filter((e) => e.matches('.child'));
			let actual = target.siblings('.child');

			assert(actual.length).equal(expected.length);
			for (let i = 0; i < expected.length; i++) {
				assert(actual[i]).instanceOf(Widget, 'Expected to be instanceof Widget');
				assert(actual[i].el).strictEqual(expected[i]);
			}
		});

		it('should return empty set if element doesn\'t have parent', () => {
			let target = new Widget(element('div'));

			let actual = target.siblings();
			assert(actual.length).equal(0);
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.siblings(true); }).throws(Error);
			assert(() => { target.siblings(null); }).throws(Error);
			assert(() => { target.siblings(123); }).throws(Error);
			assert(() => { target.siblings({}); }).throws(Error);
			assert(() => { target.siblings([]); }).throws(Error);
			assert(() => { target.siblings(element('div')); }).throws(Error);
			assert(() => { target.siblings(new Widget(element('div'))); }).throws(Error);
		});
	});

	describe('#closest', () => {
		it('should return closest matching element', () => {
			let target = new Widget(query('#child-2'));

			let expected = target.el.closest('body');
			let actual = target.closest('body');

			assert(actual).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(actual.el).strictEqual(expected);
		});

		it('should return closest matching element including self', () => {
			let target = new Widget(query('#child-2'));

			let expected = target.el;
			let actual = target.closest('div');

			assert(actual).instanceOf(Widget, 'Expected to be instanceof Widget');
			assert(actual.el).strictEqual(expected);
		});

		it('should return null when none found', () => {
			let target = new Widget(query('#child-2'));

			let actual = target.closest('dummy');

			assert(actual).isNull();
		});

		it('should throw error with invalid argument', () => {
			let target = new Widget(document.body);

			assert(() => { target.closest(true); }).throws(Error);
			assert(() => { target.closest(null); }).throws(Error);
			assert(() => { target.closest(123); }).throws(Error);
			assert(() => { target.closest({}); }).throws(Error);
			assert(() => { target.closest([]); }).throws(Error);
			assert(() => { target.closest(element('div')); }).throws(Error);
			assert(() => { target.closest(new Widget(element('div'))); }).throws(Error);
		});
	});
});
