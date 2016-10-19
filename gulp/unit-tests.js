"use strict";

const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const mochelec = require('gulp-mochelec');
const notifier = require('node-notifier');
const through = require('through2');

const TIMEOUT_PASS = 2000;
const TIMEOUT_FAIL = 4000;
const IMAGE_PASS = path.join(__dirname, 'img/pass.png');
const IMAGE_FAIL = path.join(__dirname, 'img/fail.png');

let args = require('minimist')(process.argv.slice(2));

let files = {
	sources: ['index.js', 'lib/**/*.js'],
	tests: args['test-files'] || ['test/test-*.js'],
};

// generate code coverage if '--coverage' command line flag is present
let coverage = args.coverage;
let test_grep = args['test-grep'];

function notifyFailure(err) {
	gutil.log("Failure: " + err.message);
	notifier.notify({
		'expire-time': TIMEOUT_FAIL,
		icon: IMAGE_FAIL,
		title: "Failed",
		message: err.message
	});
}

function notifyPass() {
	return through.obj((file, enc, cb) => {
		notifier.notify({
			'expire-time': TIMEOUT_PASS,
			icon: IMAGE_PASS,
			title: "Pass",
			message: "All unit tests passed."
		});
		cb(null, file);
	});
}

gulp.task('test', () => {
	return gulp.src(files.tests, { read: false })
		.pipe(mochelec({
			renderer: true,
			require: coverage ? 'test/support/require-coverage.js' : undefined,
			hook: coverage ? 'test/support/hook-coverage.js' : undefined,
			grep: test_grep,
		}))
		.on('error', notifyFailure)
		.pipe(notifyPass())
});

gulp.task('test:watch', ['test'], () => {
	let files = [].concat(files.sources, files.tests);
	gulp.watch(files, ['test']);
});
