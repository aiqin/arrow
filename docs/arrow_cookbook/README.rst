===========
Arrow Usage
===========


Synopsis
========
| arrow [OPTION...] [TESTFILE...]


Description
===========
Arrow is a test framework designed to promote test-driven JavaScript development. Arrow provides a consistent test creation and execution environment for both Developers and Quality Engineers.

Arrow aims to completely remove the line between development’s Unit tests, and Functional and Integration tests by providing a uniform way to create and execute both.

Arrow itself is a thin, extensible layer that marries JavaScript, NodeJS, PhantomJS and Selenium. Arrow allows you to write tests using YUI-Test and execute those tests using NodeJS, PhantomJS or Selenium. Additionally, Arrow provides a rich mechanism for building, organizing and executing test and test scenarios.


Options
=======
--help
  display this help page
--version
  display installed arrow version
--lib			comma separated list of js files needed by the test
--page			path to the mock or production html page, for example: http://www.yahoo.com or mock.html
--driver		selenium|phantomjs|browser|hybridApp. (default: phantomjs)
--browser		firefox|chrome|opera|reuse.  Specify browser version with a hypen, ex.: firefox-4.0 or opera-11.0 (default: firefox)
--controller		a custom controller javascript file
--reuseSession		true/false. Specifies whether to run tests in existing sessions managed by selenium. Visit http://selenuim_host/wd/hub to setup sessions (default: false)
--report		true/false. Creates report files in junit and json format, and also prints a consolidated test report summary on console
--testName		comma separated list of test names defined in test descriptor. all other tests will be ignored
--group			comma separated list of groups defined in test descriptor, all other groups will be ignored
--logLevel		DEBUG|INFO|WARN|ERROR|FATAL (default: INFO)
--dimension		a custom dimension file for defining ycb contexts
--context		name of ycb context
--hybridAppTestServer		override hybridAppTestServer host url (example: --hybridAppTestServer=http://host:port/shanghai), default is http://localhost:9000/shanghai.

Examples
========
| Below are some examples to help you get started.

| Unit test:
|    arrow --lib=../src/greeter.js test-unit.js

| Unit test with a mock page:
|    arrow --page=testMock.html --lib=./test-lib.js test-unit.js

|  Unit test with selenium:
|    arrow --page=testMock.html --lib=./test-lib.js --driver=selenium test-unit.js

|  Integration test:
|    arrow --page=http://www.hostname.com/testpage --lib=./test-lib.js test-int.js

|  Integration test:
|    arrow --page=http://www.hostname.com/testpage --lib=./test-lib.js --driver=selenium test-int.js

|  Custom controller:
|    arrow --controller=custom-controller.js --driver=selenium

|  Function test with hybridApp driver:
|    arrow hybridApp_descriptor.json --driver=hybridApp

See Also
========

| arrow_server(1)


Third Party Libraries
=======================

The following third-party npm modules are used by Arrow:

| glob https://github.com/isaacs/node-glob
| mockery https://github.com/nathanmacinnes/Mockery
| nopt https://github.com/isaacs/nopt
| colors https://github.com/Marak/colors.js
| express https://github.com/visionmedia/express
| yui http://github.com/yui/yui3
| JSV http://github.com/garycourt/JSV
| log4js https://github.com/nomiddlename/log4js-node
| clone https://github.com/pvorb/node-clone
| useragent https://github.com/3rd-Eden/useragent
| ytestrunner https://github.com/gotwarlost/ytestrunner

Apart from those npm modules, Arrow also uses these two tools

| selenium https://code.google.com/p/selenium/
| ghostdriver https://github.com/detro/ghostdriver
