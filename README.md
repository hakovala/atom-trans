# elec-trans

DOM manipulation library for Atom Electron

# Install

```
npm install elec-trans
```

# Run unit tests

Run all unit tests

```
gulp test
```

Run all unit tests and start watching changes in the sources.

```
gulp test:watch
```

Run all unit tests and generate source coverage.

```
gulp test --coverage
```

Run only selected unit test files.
Simple file globbing is supported for selecting test files.

```
gulp test --tests 'test/test-*.js'
```

Run only specified tests in unit test files.
Filter uses simple grep-style matching.

```
gulp test --tests 'test/test-widget.js' --filter 'prepend'
```

Run all tests and start watching source changes, create source coverage reports
and start live reloading coverage reports in browser after each unit test run.

```
gulp test:watch --coverage --live
```

# Build documentation

```
gulp doc
```
