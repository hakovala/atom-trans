"use strict";

const util = require('util');
const path = require('path');
const glob = require('glob');
const istanbul = require('istanbul');

const debug = require('debug')('test:coverage');

// source files included in coverage
const sources = ['index.js', 'lib/**/*.js'];

let instrumenter = new istanbul.Instrumenter();

// collect the source files
let files = sources
	.map((src) => glob.sync(src))
	.reduce((files, cur) => files.concat(cur));

debug('sources: %o', files);

// hook require so that it will return instrumented code for source files
istanbul.hook.hookRequire(function matcher(file) {
	return files.some((f) => path.relative(file, f).length === 0);
}, function transformer(code, file) {
	debug('require instrumented: %s', path.relative('.', file));
	return instrumenter.instrumentSync(code, path.relative('.', file));
});
