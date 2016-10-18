const fs = require('fs');
const path = require('path');

const istanbul = require('istanbul');

function generateReports(coverage) {
	let collector = new istanbul.Collector();
	let reporter = new istanbul.Reporter();

	collector.add(coverage);

	reporter.addAll(['text', 'lcov']);
	reporter.write(collector, true, function() {
		console.log('Reports generated');
	});
}

module.exports = function(mocha, runner) {
	runner.on('end', function() {
		generateReports(__coverage__);
	});
};

