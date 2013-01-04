#!/bin/bash
#run by ytestrunner
ytestrunner --yui3 --include lib/controller/crt-tests.js  --cov-include ../../lib/controller/*.js --verbose --coverage
ytestrunner --yui3 --include lib/driver/crt-tests.js  --cov-include ../../lib/driver/*.js --verbose --coverage


#run by arrow
#arrow lib/controller/crt-tests.js --lib=../../lib/controller/ --coverage
#arrow lib/driver/crt-tests.js --lib=../../lib/driver/ --coverage

