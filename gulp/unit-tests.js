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
	gulp.src('./test/*.js', { read: false })
		.pipe(mochelec({
			renderer: true,
		}))
		.on('error', notifyFailure)
		.pipe(notifyPass())
});

gulp.task('test:watch', ['test'], () => {
	gulp.watch(['index.js', './lib/**/*.js', './test/*.js'], ['test']);
});
