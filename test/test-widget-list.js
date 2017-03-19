/* jshint mocha: true */
"use strict";

const helper = require('./helper');
const assert = require('./assert/extras');

const Widget = require('../lib/widget');
const WidgetList = require('../lib/widget-list');

describe('WidgetList', () => {
	describe('cosntructor', () => {
		it('should create an empty WidgetList', () => {
			let target = new WidgetList();

			assert(target)
				.instanceOf(WidgetList)
				.hasLength(0);
		});

		it('should create new empty instance WidgetList', () => {
			// silence jshint for creating WidgetList without `new` keyword
			/* jshint newcap: false */
			let target = WidgetList();

			assert(target)
				.instanceOf(WidgetList)
				.hasLength(0);
		});

		it('should accept single HTMLElement as argument', () => {
			let el = helper.element('div');
			let target = new WidgetList(el);

			assert(target)
				.hasLength(1);
			assert(target[0])
				.instanceOf(Widget);
			assert(target[0].el)
				.strictEqual(el);
		});

		it('should accept single Widget as argument', () => {
			let el = helper.element('div');
			let widget = new Widget(el);
			let target = new WidgetList(widget);

			assert(target)
				.hasLength(1)
				.includes(widget);
			assert(target[0])
				.strictEqual(widget);
		});

		it('should accept array of HTMLElements as argument', () => {
			let count = 5;
			let els = helper.array(count, (i) => helper.element('div', 'item-' + i));
			let target = new WidgetList(els);

			assert(target)
				.hasLength(count);

			els.forEach((el, i) => {
				assert(target[i]).instanceOf(Widget);
				assert(target[i].el).strictEqual(el);
			});
		});

		it('should accept array of Widgets as argument', () => {
			let count = 5;
			let widgets = helper.array(count, (i) => new Widget(helper.element('div', 'item-' + i)));
			let target = new WidgetList(widgets);

			assert(target)
				.hasLength(count);

			widgets.forEach((widget, i) => {
				assert(target[i]).strictEqual(widget);
			});
		});
	});

	describe('.from', () => {
		it('should filter non-elements', () => {
			let items = [
				undefined,
				null,
				true,
				false,
				123,
				"hello",
				{},
				[],
				function() {},
			];

			let target = WidgetList.from(items);

			assert(target)
				.instanceOf(WidgetList)
				.hasLength(0);
		});
		it('should convert HTMLElements to Widgets', () => {
			let count = 5;
			let els = helper.array(count, (i) => helper.element('div', 'item-' + 5));

			let target = WidgetList.from(els);

			assert(target)
				.instanceOf(WidgetList)
				.hasLength(count);
			els.forEach((el, i) => {
				assert(target[i]).instanceOf(Widget);
				assert(target[i].el).strictEqual(el);
			});
		});
		it('should convert array-like object to WidgetList', () => {
			let count = 2;
			let items = {
				length: count,
				'0': new Widget(helper.element('div')),
				'1': new Widget(helper.element('div')),
			};

			let target = WidgetList.from(items);

			assert(target)
				.instanceOf(WidgetList)
				.hasLength(count);

			for (let i = 0; i < count; i++) {
				let el = items[i];
				assert(target[i])
					.instanceOf(Widget)
					.strictEqual(el);
			}
		});
	});

	describe('#elements', () => {
		it('should return array of elements', () => {
			let count = 5;
			let els = helper.array(count, (i) => helper.element('div', 'item-' + 5));

			let target = WidgetList.from(els);

			let actual = target.elements();
			assert(actual)
				.isArray()
				.hasLength(count);

			els.forEach((el, i) => {
				assert(actual[i]).strictEqual(el);
			});
		});
	});

	describe('#push', () => {
		it('should push item', () => {
			let len = 3;
			let filler = helper.array(len, (i) => helper.element());
			let target = new WidgetList(filler);

			assert(target).hasLength(len);

			let w = new Widget(helper.element('div'));
			target.push(w);
			assert(target).hasLength(len + 1);
			assert(target[len]).strictEqual(w);
		});

		it('should convert HTMLElement to Widget', () => {
			let len = 3;
			let filler = helper.array(len, (i) => helper.element());
			let target = new WidgetList(filler);

			assert(target).hasLength(len);

			let el = helper.element('div');
			target.push(el);
			assert(target).hasLength(len + 1);
			assert(target[len]).instanceOf(Widget);
			assert(target[len].el).strictEqual(el);
		});

		it('should ignore other values', () => {
			let items = [
				undefined,
				null,
				true,
				false,
				123,
				"hello",
				{},
				[],
				function() {},
			];

			let target = new WidgetList();

			items.forEach((item, i) => {
				target.push(item);
				assert(target).hasLength(0, 'should have ignored: ' + item);
			});
		});
	});

	describe('#unshift', () => {
		it('should unshift item', () => {
			let len = 3;
			let filler = helper.array(len, (i) => helper.element());
			let target = new WidgetList(filler);

			assert(target).hasLength(len);

			let w = new Widget(helper.element('div'));
			target.unshift(w);
			assert(target).hasLength(len + 1);
			assert(target[0]).strictEqual(w);
		});

		it('should convert HTMLElement to Widget', () => {
			let len = 3;
			let filler = helper.array(len, (i) => helper.element());
			let target = new WidgetList(filler);

			assert(target).hasLength(len);

			let el = helper.element('div');
			target.unshift(el);
			assert(target).hasLength(len + 1);
			assert(target[0]).instanceOf(Widget);
			assert(target[0].el).strictEqual(el);
		});

		it('should ignore other values', () => {
			let items = [
				undefined,
				null,
				true,
				false,
				123,
				"hello",
				{},
				[],
				function() {},
			];

			let target = new WidgetList();

			items.forEach((item, i) => {
				target.unshift(item);
				assert(target).hasLength(0, 'should have ignored: ' + item);
			});
		});
	});

	describe('#setHTML', () => {
		it('should set every items html', () => {
			let count = 5;
			let els = helper.array(count, (i) => helper.element('div', 'item-' + i));
			let target = new WidgetList(els);

			target.forEach((widget) => {
				assert(widget.text).equal('');
			});

			let html = '<div id="dummy">Hello World!</div>';
			target.setHTML(html);

			target.forEach((widget) => {
				assert(widget.html).equal(html);
			});
		});
	});

	describe('#setText', () => {
		it('should set every items text', () => {
			let count = 5;
			let els = helper.array(count, (i) => helper.element('div', 'item-' + i));
			let target = new WidgetList(els);

			target.forEach((widget) => {
				assert(widget.text).equal('');
			});

			let text = 'Hello World!';
			target.setText(text);

			target.forEach((widget) => {
				assert(widget.text).equal(text);
			});
		});
	});
});
