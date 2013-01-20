#!/bin/bash
#run by ytestrunner
ytestrunner --yui3 --include lib/controller/hybridapp-controller-tests.js  --cov-include ../../lib/controller/*.js --verbose --coverage
ytestrunner --yui3 --include lib/driver/hybridapp-tests.js  --cov-include ../../lib/driver/*.js --verbose --coverage


#run by arrow
#arrow lib/controller/hybridapp-tests.js --lib=../../lib/controller/ --coverage
#arrow lib/driver/hybridapp-tests.js --lib=../../lib/driver/ --coverage

