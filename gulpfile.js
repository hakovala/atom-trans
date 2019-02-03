"use strict";

const { src, dest, parallel, watch } = require('gulp');
const gutil = require('gulp-util');

const tasks = {};
function exportTasks(module, prefix) {
	for (let name in module) {
		const task = module[name];
		if (prefix) {
			if (name === 'default') {
				name = prefix;
			} else {
				name = `${prefix}:${name}`;
			}
		}
		tasks[name] = task;
	}
}

exportTasks(require('./gulp/unit-tests'), 'test');
exportTasks(require('./gulp/documentation'), 'doc');
tasks.default = parallel(tasks.test, tasks.doc);
module.exports = tasks;
