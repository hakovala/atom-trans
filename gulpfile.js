"use strict";

const gulp = require('gulp');

require('./gulp/unit-tests');
require('./gulp/documentation');

gulp.task('default', ['test', 'doc']);
