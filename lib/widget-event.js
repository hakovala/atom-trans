"use strict";

const DomUtil = require('./dom-util');
const EventEmitter = require('events').EventEmitter;

const _el = Symbol('element');

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
	}

	addListener(type, listener) {
		throw new Error('NOT IMPLEMENTED');
	}

	removeListener(type, listener) {
		throw new Error('NOT IMPLEMENTED');
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
