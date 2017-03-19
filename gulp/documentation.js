"use strict";

const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');

let files = {
	sources: ['index.js', 'lib/**/*.js'],
};

gulp.task('doc', (cb) => {
	let config = require('../jsdoc.json');
	gulp.src(['README.md'].concat(files.sources), { read: false })
		.pipe(jsdoc(config, cb));
});
