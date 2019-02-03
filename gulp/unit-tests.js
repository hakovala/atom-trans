const { src, dest, parallel, series, watch } = require('gulp');
const gutil = require('gulp-util');
const path = require('path');

const mochelec = require('gulp-mochelec');
const notifier = require('node-notifier');
const through = require('through2');
const lr_server = require('gulp-server-livereload');

const TIMEOUT_PASS = 2000;
const TIMEOUT_FAIL = 4000;
const IMAGE_PASS = path.join(__dirname, 'img/pass.png');
const IMAGE_FAIL = path.join(__dirname, 'img/fail.png');
const COVERAGE_PORT = 48000;

let args = require('minimist')(process.argv.slice(2), {
	boolean: [
		'coverage', // generate code coverage when running unit tests
		'open', // open coverage report in browser when starting `test:watch`
	],
});

let files = {
	sources: ['index.js', 'lib/**/*.js'],
	tests: args.tests || ['test/test-*.js'],
	live: ['coverage/'],
};

// Command line arguments:
// `coverage`: generate code coverage from unit tests
// 'live': start livereload server watching coverage reports
// 'tests': unit test files to run as glob patterns
// 'filter': grep pattern to filter unit tests

function notifyFailure(err) {
	// silence jshint warning about possible strict violation (W040)
	/* jshint validthis: true */

	gutil.log("Failure: " + err.message);
	notifier.notify({
		'expire-time': TIMEOUT_FAIL,
		icon: IMAGE_FAIL,
		title: "Failed",
		message: err.message
	});
	this.emit('end');
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

function test() {
	const test_options = {
		renderer: true,
		grep: args.filter,
	};
	if (args.coverage) {
		test_options.require = 'test/support/require-coverage.js';
		test_options.hook = 'test/support/hook-coverage.js';
	}
	return src(files.tests, { read: false })
		.pipe(mochelec(test_options))
		.on('error', notifyFailure)
		.pipe(notifyPass());
}

function test_watch() {
	const sources = [].concat(files.sources, files.tests);
	watch(sources, test);
	return src(`${__dirname}/../coverage/lcov-report`)
		.pipe(lr_server({
			port: COVERAGE_PORT,
			livereload: true,
			open: args.open,
		}));
}

exports.default = test;
exports.watch = series(test, test_watch);
