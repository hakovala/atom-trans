"use strict";

const DomUtil = require('./dom-util');
const EventEmitter = require('events').EventEmitter;

const _el = Symbol('element');
const _registered = Symbol('registeredEvents');

// List of modifiers in events
const Modifiers = [ 'alt', 'ctrl', 'shift', 'meta' ];

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
 * Event listener for Widget.
 *
 * Adds a modular consistent event naming scheme for DOM events.
 * Adds and removes event listeners from HTMLElement as needed.
 */
class WidgetEvent extends EventEmitter {

	/**
	 * Create WidgetEvent wrapper for HTMLElement
	 * @param  {HTMLElement} element HTML element
	 */
	constructor(element) {
		super();

		if (!DomUtil.isElement(element)) {
			throw new Error('Element must be instance of HTMLElement');
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
	 * @param  {Boolean}  capture  Capture flag for DOM `addEventListener`
	 */
	on(selector, listener, capture) {
		this.addListener(selector, listener, capture);
	}

	/**
	 * Alias for `on(selector, listener, capture)`.
	 * @param {String}   selector Event selector string
	 * @param {Function} listener Listener callback function
	 * @param {Boolean}  capture  Capture flag for DOM `addEventListener`
	 */
	addListener(selector, listener, capture) {
		// normalize `capture` to boolean
		capture = !!capture;

		let event = WidgetEvent.parseEventSelector(selector);

		// if selector isn't for DOM event, no magic is needed and listener is added
		// as a normal listener only
		if (event.event) {
			// this is a for DOM event, magic needed..
			let eventName = event.event;
			if (capture) {
				// differentiate listeners with and without capture flag
				eventName += '-capture';
			}
			// create cache for the event emitter, includes a counter so
			// that we know when we can remove the listener.
			this[_registered][eventName] = this[_registered][eventName] || {
				count: 0,
				emitter: null,
			};
			let registered = this[_registered][eventName];

			// if registered counter is zero, we need to create a emitter and add that
			// listener to the element.
			if (registered.count === 0) {
				let emit = this.emit.bind(this, event.type + ':' + event.name);
				this[_el].addEventListener(event.event, emit, capture);
				registered.emitter = emit; // cache emitter function
			}
			registered.count += 1; // increase registered counter

			// construct proper normalized event name to add for
			selector = event.type + ':' + event.name;
			if (event.selector) {
				selector += ':' + event.selector;
			}
			if (capture) {
				selector += '-capture';
			}
		}

		// add listener to this EventEmitter
		super.addListener(selector, listener);
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
	 */
	removeListener(selector, listener, capture) {
		// normalize `capture` to boolean
		capture = !!capture;

		let event = WidgetEvent.parseEventSelector(selector);

		// if selector isn't for DOM event, no magic is needed and listener is added
		// as a normal listener only.
		if (event.event) {
			// this is for a DOM event, magic needed..
			let eventName = event.event;
			if (capture) {
				// differentiate listeners with and without capture flag
				eventName += '-capture';
			}

			let registered = this[_registered][eventName];
			// check if DOM event has been registered
			if (registered) {
				if (typeof listener !== 'function') {
					// no listener function given, remove all listeners
					registered.count = 0;
				} else {
					// decrement registered counter
					registered.count -= 1;
				}

				// check if there are still listeners registered for this selector
				// if not then we can remove listener from DOM
				if (registered.count === 0) {
					this[_el].removeEventListener(event.event, registered.emitter, capture);
					// delete registered object from cache
					delete this[_registered][eventName];
				}
			}

			selector = event.type + ':' + event.name;
			if (event.selector) {
				selector += ':' + event.selector;
			}
			if (capture) {
				selector += '-capture';
			}
		}
		if (typeof listener !== 'function') {
			// no listener function given, remove all listeners
			this.removeAllListeners(selector);
		} else {
			// remove listener from this EventEmitter
			super.removeListener(selector, listener);
		}
	}

	/**
	 * Parse selector into individual parts.
	 *
	 * Case of the selector parts and extra white spaces are ignored.
	 *
	 * Result object properties:
	 *  - `which`: key code or mouse button
	 *  - `alt`: `true` if selector has Alt modifier
	 *  - `ctrl`: `true` if selector has Ctrl modifier
	 *  - `shift`: `true` if selector has Shift modifier
	 *  - `meta`: `true` if selector has Meta modifier
	 *
	 * @param  {String} selector Event selector string
	 * @return {Object}          Object with `which` and mods
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
	 * Result object properties:
	 *  - `type`: Type of the event, ie. `key` or `mouse`
	 *  - `name`: Name of the event, ie. `press` or `click`
	 *  - `selector`: Event selector string, ie. `ctrl+space`
	 *  - `event`: DOM event name
	 *
	 * @param  {String} event Event selector string
	 * @return {Object}       Event selector object
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
