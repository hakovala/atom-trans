"use strict";

const { src, dest, parallel, series, watch } = require('gulp');
const jsdoc = require('gulp-jsdoc3');

const files = {
	sources: ['index.js', 'lib/**/*.js'],
};

const doc_config = require('../jsdoc.json');

function doc(cb) {
	src(['README.md'].concat(files.sources), { read: false })
		.pipe(jsdoc(doc_config, cb));
}

function doc_watch() {
	watch(files.sources, doc);
}

exports.default = doc;
exports.watch = series(doc, doc_watch);
