#!/bin/bash
jshint js/mobipick.js --config tests/jshint.json
phantomjs tests/runner.js tests/tests.html
