/* global KeyboardEvent */ // TODO: jshint doesn't know about KeyboardEvent
"use strict";

const DomUtil = require('./dom-util');
const EventEmitter = require('events').EventEmitter;

// list of private properties and methods
const _el = Symbol('element');
const _registered = Symbol('registeredEvents');
const _addDOMListener = Symbol('addDOMListener');
const _removeDOMListener = Symbol('removeDOMListener');
const _removeAllDOMListeners = Symbol('removeAllDOMListeners');

// List of modifiers in events
const Modifiers = [ 'alt', 'ctrl', 'shift', 'meta' ];

// Type definitions for documentation

/**
 * @typedef DOMEventMap
 * @type {Object.<String, Object.<String, String> >}
 */

/**
 * Object describing mouse and keyboard events
 * @typedef {Object} SelectorObject
 * @property {String}  which Key code or mouse button
 * @property {Boolean} alt   Alt modifier state
 * @property {Boolean} ctrl  Ctrl modifier state
 * @property {Boolean} shift Shift modifier state
 * @property {Boolean} meta  Meta modifier state
 */

/**
 * Event selector object
 * @typedef {Object} EventSelector
 * @property {String} type Type of the event, ie. `key` or `mouse`
 * @property {String} name Name of the event, ie. `press` or `click`
 * @property {String} selector Event selector string, ie. `ctrl+space`
 * @property {String} event DOM event name
 */

// DOM event mapping
const EventMap = {
	mouse: {
		'click': 'click',
		'dblclick': 'dblclick',
		'down': 'mousedown',
		'up': 'mouseup',
		'enter': 'mouseenter',
		'leave': 'mouseleave',
		'move': 'mousemove',
		'out': 'mouseout',
		'over': 'mouseover',
		'wheel': 'wheel',
		'contextmenu': 'contextmenu',
	},
	key: {
		'press': 'keypress',
		'down': 'keydown',
		'up': 'keyup',
	},
	form: {
		'blur': 'blur',
		'focus': 'focus',
		'focusin': 'focusin',
		'focusout': 'focusout',
		'input': 'input',
		'search': 'search',
		'select': 'select',
	},
	drag: {
		'drag': 'drag',
		'start': 'dragstart',
		'enter': 'dragenter',
		'over': 'dragover',
		'leave': 'dragleave',
		'end': 'dragend',
		'drop': 'drop'
	},
	view: {
		'scroll': 'scroll'
	},
	media: {
		'abort': 'abort',
		'canplay': 'canplay',
		'canplaythrough': 'canplaythrough',
		'duration': 'durationchange',
		'empty': 'emptied',
		'end': 'ended',
		'error': 'error',
		'load': 'loadeddata',
		'metadata': 'loadedmetadata',
		'loading': 'loadstart',
		'pause': 'pause',
		'play': 'play',
		'playing': 'playing',
		'progress': 'progress',
		'ratechange': 'ratechange',
		'seek': 'seeked',
		'seeking': 'seeking',
		'stalled': 'stalled',
		'suspend': 'suspend',
		'time': 'timeupdate',
		'volume': 'volumechange',
		'waiting': 'waiting'
	},
};

/**
 * Make event listener selector name.
 * @param  {Object}  event   Event selector object
 * @param  {Boolean} capture Capture flag
 * @return {String}          Event selector string
 */
function makeEventSelector(event, capture) {
	let selector = event.type + ':' + event.name;
	if (capture) {
		selector += '-capture';
	}
	if (event.selector) {
		selector += ':' + event.selector;
	}
	return selector;
}

/**
 * @classdesc Event listener for Widget.
 *
 * Adds a modular consistent event naming scheme for DOM events.
 * Adds and removes event listeners from HTMLElement as needed.
 *
 * @class
 * @augments EventEmitter
 */
class WidgetEvent extends EventEmitter {

	/**
	 * DOM event mapping
	 * @readonly
	 * @type {DOMEventMap}
	 */
	static get EventMap() { return EventMap; }
	/**
	 * Available modifier keys
	 * @readonly
	 * @type {Array}
	 */
	static get Modifiers() { return Modifiers; }

	/**
	 * Create WidgetEvent wrapper for HTMLElement
	 * @param  {HTMLElement} element HTML element
	 * @throws {Error} If the given element is not instance of HTMLElement
	 */
	constructor(element) {
		super();

		if (!DomUtil.isElement(element)) {
			throw new Error('Element must be instance of DOM Element');
		}

		this[_el] = element;
		this[_registered] = {};
	}

	/**
	 * Adds the given listener for events named `selector`.
	 * If the selector matches a DOM event name then the listener is added also
	 * to the DOM element.
	 * Only one DOM `addEventListener` call is made for given event selector,
	 * WidgetEvent keeps track of event listener counts internally. And
	 * redirects emitted events for propriate listeners, ie. listeners with key
	 * code selectors.
	 *
	 * Event selector string is constructed from multiple parts which are separated
	 * with `:`, ie. `key:press:ctrl+space`.
	 * First part is for the DOM event type, ie. `key` or `mouse`, full list of
	 * event types can be queried with `WidgetEvent.getEventTypes()`.
	 * Second part is for the DOM event name, ie. `press` or `click`, full list of
	 * available names for given type can be queried with
	 * `WidgetEvent.getEventNames(<type>)`. Third part is an optional event
	 * filtering selector, ie. `ctrl+space` or `Alt+Shift+KeyD`.
	 *
	 * @param  {String}   selector Event selector string
	 * @param  {Function} listener Listener callback function
	 * @param  {Boolean=}  capture  Capture flag for DOM `addEventListener`
	 * @override
	 */
	on(selector, listener, capture) {
		this.addListener(selector, listener, capture);
	}

	/**
	 * Alias for `on(selector, listener, capture)`.
	 * @param {String}   selector Event selector string
	 * @param {Function} listener Listener callback function
	 * @param {Boolean=}  capture  Capture flag for DOM `addEventListener`
	 * @override
	 * @see {@link WidgetEvent#on} for more information.
	 */
	addListener(selector, listener, capture) {
		// normalize `capture` to boolean
		capture = !!capture;

		let event = WidgetEvent.parseEventSelector(selector);

		// if selector isn't for DOM event, no magic is needed and listener is added
		// as a normal listener only
		if (event.event) {
			// construct proper normalized event name to add as listener
			selector = makeEventSelector(event, capture);

			// add DOM event listener for the event
			this[_addDOMListener](event, capture);
		}

		// add listener to this EventEmitter
		super.addListener(selector, listener);
	}

	/**
	 * Add DOM listener.
	 *
	 * DOM listener is only added once for the same event. Any subsequent calls
	 * will only increase the registered counter.
	 * DOM listener is bound to emit EventEmitter event using event name mapping.
	 *
	 * @private
	 * @param {Object}  event   Event object from `parseEventSelector`
	 * @param {Boolean} capture Capture flag for DOM `addEventListener`
	 */
	[_addDOMListener](event, capture) {
		let eventName = event.event;
		if (capture) {
			// differentiate listeners with and without capture flag
			eventName += '-capture';
		}
		// create cache for the event emitter, includes a counter so
		// that we know when we should remove the listener.
		this[_registered][eventName] = this[_registered][eventName] || {
			count: 0,
			emitter: null,
			event: event.event,
			capture: capture,
		};
		let registered = this[_registered][eventName];

		// if registered counter is zero, we need to create a emitter and add that
		// listener to the element.
		if (registered.count === 0) {
			// create and cache event emitter
			registered.emitter = this.emit.bind(this, makeEventSelector(event, capture));
			this[_el].addEventListener(event.event, registered.emitter, capture);
		}
		registered.count += 1; // increase registered counter
	}

	/**
	 * Removes the given listener with event named `selector`.
	 * If the selector matches a DOM event name and this is the last listener for
	 * that DOM event, the listener is removed from the DOM.
	 *
	 * If `listener` is not a function, then all listeners matching `selector` are
	 * removed and DOM event listeners with that selector is removed.
	 *
	 * @param  {String}   selector Event selector string
	 * @param  {Function} listener Listener callback function, can be omitted
	 * @param  {Boolean}  capture  Capture flag for DOM `addEventListener`
	 * @override
	 */
	removeListener(selector, listener, capture) {
		if (typeof listener !== 'function') {
			// remove listener only if listener is given
			return;
		}

		// normalize `capture` to boolean
		capture = !!capture;

		let event = WidgetEvent.parseEventSelector(selector);

		// if selector isn't for DOM event, no magic is needed and listener is added
		// as a normal listener only.
		if (event.event) {

			// construct proper normalized event name to add as listener
			selector = makeEventSelector(event, capture);

			// check that the given listener is actually added to this selector
			if (this.listeners(selector).includes(listener)) {
				// remove listener from DOM
				this[_removeDOMListener](event, capture);
			}
		}

		// remove listener from this EventEmitter
		super.removeListener(selector, listener);
	}

	/**
	 * Remove DOM listener.
	 *
	 * DOM listener is only removed if the given listeners is actually added as
	 * listener. DOM listener is only removed if the associated registered counter
	 * goes to zero, this indicates that there is no more listeners listening
	 * the given event selector.
	 *
	 * @private
	 * @param {Object}  event   Event object from `parseEventSelector`
	 * @param {Boolean} capture Capture flag for DOM `addEventListener`
	 */
	[_removeDOMListener](event, capture) {
		let eventName = event.event;
		if (capture) {
			// differentiate listeners with and without capture flag
			eventName += '-capture';
		}

		let registered = this[_registered][eventName];
		// check if DOM event has been registered
		if (registered) {
			// decrement registered counter
			registered.count -= 1;
		}

		// check if there are still listeners registered for this selector
		// if not then we can remove listener form DOM
		if (registered.count <= 0) {
			this[_el].removeEventListener(registered.event, registered.emitter, registered.capture);
			// delete registered object from cache
			delete this[_registered][eventName];
		}
	}

	/**
	 * **TODO**: Add description
	 *
	 * @param  {String} type Event type
	 * @param  {...any} args Event arguments
	 * @override
	 */
	emit(type, ...args) {
		let event = WidgetEvent.parseEventSelector(type);

		if (event.event) {
			let evt = args[0];
			let selector = WidgetEvent.getSelectorFromEvent(evt);

			// put the selector in to the event object
			if (selector) {
				evt.selector = selector;
			}

			// trigger base DOM event type, ie. `mouse:click`
			super.emit(type, ...args);

			if (selector) {
				// trigger specific DOM event type, ie. 'mouse:click:alt+shift+button1'
				super.emit(`${type}:${selector}`, ...args);
			}
		} else {
			super.emit(type, ...args);
		}
	}

	/**
	 * **TODO**: Add description
	 *
	 * @param {String}   selector Event selector string
	 * @param {Function} listener Listener callback function
	 * @param {Boolean=}  capture  Capture flag for DOM `addEventListener`
	 * @override
	 */
	once(selector, listener, capture) {
		let self = this;
		function callback(...args) {
			self.removeListener(selector, callback, capture);
			listener(...args);
		}
		this.addListener(selector, callback, capture);
	}

	/**
	 * **NOT IMPLEMENTED**
	 * @override
	 */
	prependListener(selector, listener, capture) {
		throw new Error('NOT IMPLEMENTED');
	}

	/**
	 * **NOT IMPLEMENTED**
	 * @override
	 */
	prependOnceListener(selector, listener, capture) {
		throw new Error('NOT IMPLEMENTED');
	}

	/**
	 * Removes all listeners, or those of the specified event name.
	 * Remove also all matching DOM event listeners.
	 * @param  {String} selector Event selector string
	 * @override
	 */
	removeAllListeners(selector) {
		if (typeof selector === 'string') {
			// parse event selector object from selector string
			let event = WidgetEvent.parseEventSelector(selector);

			if (event.event) {
				// remove all DOM listeners for the given selector
				this[_removeAllDOMListeners](event);
				// remove both capture and non-capture listeners
				super.removeAllListeners(makeEventSelector(event, false));
				super.removeAllListeners(makeEventSelector(event, true));
			} else {
				// this is a non-DOM event selector
				super.removeAllListeners(selector);
			}
		} else {
			// remove ALL DOM listeners and EventEmitter listeners
			this[_removeAllDOMListeners]();
			super.removeAllListeners();
		}
	}

	[_removeAllDOMListeners](event) {
		let remove = (registered) => {
			if (registered) {
				this[_el].removeEventListener(registered.event, registered.emitter, registered.capture);
			}
		};

		if (event) {
			// remove only one DOM listener, both capture and non-capture variant
			remove(this[_registered][event.event]);
			remove(this[_registered][event.event + '-capture']);
		} else {
			// remove ALL DOM listeners
			for (let eventName in this[_registered]) {
				remove(this[_registered][eventName]);
			}
		}
	}

	/**
	 * Format selector object into selector string.
	 *
	 * @param {SelectorObject} obj Selector object
	 * @return {String}            Selector string
	 */
	static formatSelector(obj) {
		let parts = [];

		for (let mod of Modifiers) {
			if (obj[mod]) {
				parts.push(mod);
			}
		}

		if (typeof obj.which !== 'string') {
			throw new Error('Missing event which property');
		}
		parts.push(obj.which);
		return parts.join('+').toLowerCase();
	}

	/**
	 * Get selector string from DOM event object.
	 *
	 * Supported events:
	 *  - `MouseEvent`
	 *  - `KeyboardEvent`
	 *
	 * @param  {Event}  evt DOM event object
	 * @return {String}     Selector string
	 */
	static getSelectorFromEvent(evt) {
		let obj = {};
		if (evt instanceof MouseEvent) {
			obj.which = 'button' + evt.button;
		} else if (evt instanceof KeyboardEvent) {
			obj.which = evt.code;
		} else {
			// unknown event object
			return null;
		}

		for (let mod of Modifiers) {
			obj[mod] = !!evt[mod + 'Key'];
		}

		return WidgetEvent.formatSelector(obj);
	}

	/**
	 * Parse selector into individual parts.
	 *
	 * Case of the selector parts and extra white spaces are ignored.
	 *
	 * @param  {String} selector Event selector string
	 * @return {SelectorObject}  Object with `which` and mods
	 */
	static parseSelector(selector) {
		if (typeof selector !== 'string') {
			throw new Error('Event selector must be string, got: ' + (typeof selector));
		}

		// result object template with default values
		let tmpl = {
			which: undefined,
			alt: false,
			ctrl: false,
			shift: false,
			meta: false,
		};

		let parts = selector.split('+');
		let res = parts.reduce((o, current) => {
			// normalize
			current = current.toLowerCase().trim();

			if (Modifiers.includes(current)) {
				// current part is a modifier
				o[current] = true;
			} else {
				o.which = current;
			}

			return o;
		}, tmpl);

		return res;
	}

	/**
	 * Format selector object to normalized selector string.
	 * This ensures that the selector string has all the parts in a
	 * consistent order.
	 *
	 * @param  {String} selector Selector string
	 * @return {String}          Normalized selector
	 */
	static normalizeSelector(selector) {
		// parse selector string
		let obj = this.parseSelector(selector);

		// construct selector form parsed selector
		// using mods array
		let res = Modifiers.filter(m => obj[m]);
		// add `which` to end of the selector
		res.push(obj.which);
		// resulting selector has all the components joined with `+`
		return res.join('+');
	}

	/**
	 * Parse event selector string.
	 *
	 * @param  {String} event  Event selector string
	 * @return {EventSelector} Event selector object
	 */
	static parseEventSelector(event) {
		let parts = event.split(':');

		// initial event object
		let obj = {
			type: parts[0], // event type, ie. `key` or `mouse`
			name: parts[1], // event name, ie. `press` or `click`
			selector: undefined,
			event: undefined,
		};
		if (obj.name) {
			obj.name = obj.name.replace(/-capture$/, '');
		}

		if (parts.length > 2) {
			obj.selector = this.normalizeSelector(parts.slice(2).join(':'));
		}

		if (obj.type in EventMap && obj.name in EventMap[obj.type]) {
			obj.event = EventMap[obj.type][obj.name];
		}

		return obj;
	}

	/**
	 * Get list of available event types
	 * @return {Array} Array of event types
	 */
	static getEventTypes() {
		return Object.keys(EventMap);
	}

	/**
	 * Get list of available event names in type
	 * @param  {String} type Event type
	 * @return {Array}       Array of event names in type
	 */
	static getEventNames(type) {
		return Object.keys(EventMap[type]).map(name => type + ':' + name);
	}

	/**
	 * Get mapped DOM event name
	 * @param  {String} type Event type
	 * @param  {String} name Event name
	 * @return {String}      DOM event name or null if not found
	 */
	static getDOMEventName(type, name) {
		if (type in EventMap && name in EventMap[type]) {
			return EventMap[type][name];
		}
		return null;
	}
}
module.exports = WidgetEvent;
