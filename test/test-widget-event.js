/* jshint mocha: true */
// TODO: wtf, jshint doesn't know about `KeyboardEvent` object?
/* global KeyboardEvent */
"use strict";

const debug = require('debug')('test-events');

const helper = require('./helper');
const assert = require('./assert/dom');

const WidgetEvent = require('../lib/widget-event');

const test_html = `
<div id="target"></div>
`;

function createMouseEvent(type, button, options) {
	options = options || {};
	options.button = button;
	return new MouseEvent(type, options);
}

function triggerMouseEvent(element, type, button, options) {
	let evt = createMouseEvent(type, button, options);
	return element.dispatch(evt);
}

function createKeyEvent(type, code, options) {
	options = options || {};
	options.code = code;
	return new KeyboardEvent(type, options);
}

function triggerKeyEvent(element, type, key, options) {
	let evt = createKeyEvent(type, key, options);
	return element.dispatch(evt);
}

describe('Widget Events', () => {
	let body;
	let target;

	beforeEach(() => {
		// clean up test html body
		document.body.innerHTML = test_html;

		// prepare target elements for each test
		body = document.body;
		target = helper.query('#target');
	});

	describe('WidgetEvent', () => {

		describe('constructor', () => {
			it('should throw Error with missing element', () => {
				assert(() => {
					let dummy = new WidgetEvent();
				}).throws(Error, 'Should throw Error for missing element.');
			});

			it('should throw Error when passing string as element', () => {
				assert(() => {
					let dummy = new WidgetEvent('Hello');
				}).throws(Error, 'Should throw Error for missing element.');
			});

			it('should throw Error when passing object as element', () => {
				assert(() => {
					let dummy = new WidgetEvent({});
				}).throws(Error, 'Should throw Error for missing element.');
			});
		});

		describe('formatSelector', () => {
			it('should throw Error with non-string selector', () => {
				assert(() => {
					WidgetEvent.parseSelector({});
				}).throws(Error);
			});

			it('should parse selector parts', () => {
				let parts;
				function assertParts(parts, which, alt, ctrl, shift, meta) {
					assert(parts.which).equal(which);
					assert(parts.alt).strictEqual(alt);
					assert(parts.ctrl).strictEqual(ctrl);
					assert(parts.shift).strictEqual(shift);
					assert(parts.meta).strictEqual(meta);
				}

				parts = WidgetEvent.parseSelector('Space');
				assertParts(parts, 'space', false, false, false, false);

				parts = WidgetEvent.parseSelector('Ctrl+Space');
				assertParts(parts, 'space', false, true, false, false);

				parts = WidgetEvent.parseSelector('Alt+Ctrl+Space');
				assertParts(parts, 'space', true, true, false, false);

				parts = WidgetEvent.parseSelector('Space+Alt+Shift+Ctrl');
				assertParts(parts, 'space', true, true, true, false);

				parts = WidgetEvent.parseSelector('Space+Shift');
				assertParts(parts, 'space', false, false, true, false);

				parts = WidgetEvent.parseSelector('Shift+KeyD+Ctrl');
				assertParts(parts, 'keyd', false, true, true, false);

				parts = WidgetEvent.parseSelector('Shift+Alt+enter+Ctrl+Meta');
				assertParts(parts, 'enter', true, true, true, true);

				parts = WidgetEvent.parseSelector(' Shift + Alt + enter + Ctrl + Meta  ');
				assertParts(parts, 'enter', true, true, true, true);

				parts = WidgetEvent.parseSelector('Space+KeyD+Enter');
				assertParts(parts, 'enter', false, false, false, false);
			});
		});

		describe('normalizeSelector', () => {
			it('should normalize without modifiers', () => {
				assert(WidgetEvent.normalizeSelector('Space')).equal('space');
				assert(WidgetEvent.normalizeSelector('KeyD')).equal('keyd');
				assert(WidgetEvent.normalizeSelector(' enter ')).equal('enter');
			});

			it('should normalize with modifiers', () => {
				assert(WidgetEvent.normalizeSelector('Alt+Space')).equal('alt+space');
				assert(WidgetEvent.normalizeSelector('Shift + Space')).equal('shift+space');
			});

			it('should normalize the order', () => {
				assert(WidgetEvent.normalizeSelector('Space+Ctrl')).equal('ctrl+space');
				assert(WidgetEvent.normalizeSelector('Meta+Space+Shift')).equal('shift+meta+space');
				assert(WidgetEvent.normalizeSelector('Alt+Space+Meta+Ctrl+Shift')).equal('alt+ctrl+shift+meta+space');
			});

			it('should remove duplicates', () => {
				assert(WidgetEvent.normalizeSelector('Space+Space+Ctrl+Ctrl')).equal('ctrl+space');
			});

			it('should only take last which', () => {
				assert(WidgetEvent.normalizeSelector('Space+Enter')).equal('enter');
			});
		});

		describe('parseEventSelector', () => {
			function assertEvent(actual, type, name, selector, event) {
				assert(actual.type).equal(type);
				assert(actual.name).equal(name);
				assert(actual.selector).equal(selector);
				assert(actual.event).equal(event);
			}

			it('should parse type', () => {
				let actual = WidgetEvent.parseEventSelector('mouse');
				assertEvent(actual, 'mouse');
			});

			it('should parse type and name', () => {
				let actual = WidgetEvent.parseEventSelector('mouse:click');
				assertEvent(actual, 'mouse', 'click', undefined, 'click');
			});

			it('should parse type, name and selector', () => {
				let actual = WidgetEvent.parseEventSelector('key:press:Ctrl+Space');
				assertEvent(actual, 'key', 'press', 'ctrl+space', 'keypress');
			});

			it('should map event to dom event', () => {
				let actual = WidgetEvent.parseEventSelector('key:press:enter');
				assertEvent(actual, 'key', 'press', 'enter', 'keypress');
			});

			it('should have undefined `event` for non dom event', () => {
				let actual = WidgetEvent.parseEventSelector('hello');
				assertEvent(actual, 'hello');
				actual = WidgetEvent.parseEventSelector('hello:world');
				assertEvent(actual, 'hello', 'world');
			});
		});

		describe('getEventTypes', () => {
			it('should return list of all event types', () => {
				let expected = [
					'mouse',
					'key',
					'form',
					'drag',
					'view',
					'media',
				];
				assert(WidgetEvent.getEventTypes()).deepEqual(expected);
			});
		});

		describe('getEventNames', () => {
			it('should return list of all event names in type', () => {
				let expected = [
					'key:press',
					'key:down',
					'key:up',
				];
				assert(WidgetEvent.getEventNames('key')).deepEqual(expected);
			});
		});

		describe('getDOMEventName', () => {
			it('should return mapped DOM event', () => {
				let expected = 'keypress';
				assert(WidgetEvent.getDOMEventName('key', 'press')).equal(expected);
			});

			it('should return null if not found', () => {
				assert(WidgetEvent.getDOMEventName('hello', 'world')).isNull();
				assert(WidgetEvent.getDOMEventName('key', 'hello')).isNull();
			});
		});
	});

});
