#!/bin/bash
jshint js/mobipick.js --config tests/jshint.json
if [ "$?" != "0" ]; then
	exit 1;
fi
phantomjs tests/runner.js tests/tests.html
if [ "$?" != "0" ]; then
	exit 2;
fi

