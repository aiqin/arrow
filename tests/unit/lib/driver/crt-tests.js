/*
 * Copyright (c) 2012-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License. 
 * See the accompanying LICENSE file for terms.
 */

YUI.add('crt-tests', function (Y, NAME) {

        var path = require('path'),
            util = require('util'),
            fs = require('fs'),
            arrowRoot  = path.join(__dirname, '../../../..'),
            driverClass = require(arrowRoot + '/lib/driver/crt.js');

        driverClass.wdAppPath = arrowRoot + '/tests/unit/stub/crtwebdriver.js';

        var suite = new Y.Test.Suite(NAME);
        var correctConfig = {
                testSeed : arrowRoot + '/lib/client/yuitest-seed.js',
                testRunner : arrowRoot + '/lib/client/yuitest-runner.js',
                defaultAppSeed : 'http://yui.yahooapis.com/3.6.0/build/yui/yui-mins.js'
            },

            correctTestParams = {
                test: arrowRoot + '/tests/unit/lib/controller/default-tests.js',
                lib : arrowRoot + '/lib/common/yui-arrow.js',
                action : arrowRoot + '/lib/client/qunit-runner.js'
            };

        function createDriverJs_false (testParams, callback) {
            return false;
        }

        function createDriverJs_true (testParams, callback) {
            return true;
        }

        function getCrtUrl_false(url) {
            return false;
        }

        function getCrtUrl_true(url) {
            return true;
        } 
        suite.add(new Y.Test.Case({
                'test start function when crtTestServer is not set' : function () {
                       var driver, config,start;

                       config = {};
                       driver = new driverClass(config,{});
                       driver.start(function (msg) {
                           start = true;
                           Y.Assert.areEqual(msg, "Could not determine shanghai server");
                           });
                       Y.Assert.isTrue(start);
                },

                'test start function when crtTestServer is set and correct' : function () {
                var driver, config, start;

                config = {crtTestServer:"http://localhost:9000/shanghai"};
                driver = new driverClass(config,{});
                driver.start(function(msg){
                           start = true;
                           Y.Assert.areEqual(msg, "create webdriver successfully");
                    });

                Y.Assert.isTrue(start);
                },

                'test stop function when there is no sessionid' : function (){
                    var driver, config, stop;

                    config = {crtTestServer:"http://localhost:9000/shanghai"};
                    driver = new driverClass(config,{});

                    driver.sessionId = null;
                    driver.start(function(msg){
                            Y.Assert.areEqual(msg, "create webdriver successfully");
                     });

                    driver.stop(function(msg){
                         stop = true;
                         Y.Assert.areEqual(msg,null);
                    });

                    Y.Assert.isTrue(stop);
                   
                },

                'test stop function when there is sessionid' : function() {
                         var driver, config, stop;

                         config = {crtTestServer:"http://localhost:9000/shanghai"};
                         driver = new driverClass(config,{});

                         driver.sessionId = "1356069651953-5-client";
                         driver.start(function(msg){
                                 Y.Assert.areEqual(msg, "create webdriver successfully");
                                 }); 

                         driver.stop(function(msg){
                                 stop = true;
                                 Y.Assert.areEqual(msg, "quit from webdriver successfully");
                                 }); 

                         Y.Assert.isTrue(stop);
                },

                'test createDriverJs when there is no test and action in the testParams' : function () {
                    var driver, testParams={}, called, config={};
                  
                    driver = new driverClass(config,{});
                    driver.createDriverJs(testParams, function(msg){
                             called = true;
                             Y.Assert.areEqual(msg, "The test or the action js must be specified");
                             });
                    Y.Assert.isTrue(called);
                },

               'test createDriverJs when all the params are correct and has action script and with no arrow running' : function () {
                   var driver = new driverClass(correctConfig, correctTestParams);

                   function getArrowServerBase(){
                       return false;
                   }

                   driver.getArrowServerBase = getArrowServerBase;

                   //the scriptType is action and there is test
                   var result = driver.createDriverJs(correctTestParams, function(){});
                   var testLibsJs = fs.readFileSync(correctTestParams.lib, "utf8") + fs.readFileSync(correctTestParams.test, "utf8"),
                       runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8"),
                       seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");
                       expectResult = "ARROW = {};" +
                                   "ARROW.driver = 'crt';" +
                                   "ARROW.autoTest = false;" +
                                   "ARROW.testParams = " + JSON.stringify(correctTestParams) + ";" +
                                   "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                                   "ARROW.testLibs = [];" +
                                   "ARROW.scriptType = \"action\";" +
                                   "ARROW.testScript = \"\";" +
                                   "ARROW.actionScript = \"\";" +
                                   "ARROW.onSeeded = function() { " + testLibsJs + runnerJs + " };" + seedJs;

                   Y.Assert.areEqual(result,expectResult);

                   //the scriptType is action and there is no test
                   testParams = {
                        lib : arrowRoot + '/lib/common/yui-arrow.js',
                        action : arrowRoot + '/lib/client/qunit-runner.js'
                   };

                   result = driver.createDriverJs(testParams, function(){});
                   testLibsJs = fs.readFileSync(testParams.lib, "utf8") + fs.readFileSync(testParams.action, "utf8"),
                   runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8"),
                   seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");

                   expectResult = "ARROW = {};" +
                       "ARROW.driver = 'crt';" +
                       "ARROW.autoTest = false;" +
                       "ARROW.testParams = " + JSON.stringify(testParams) + ";" +
                       "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                       "ARROW.testLibs = [];" +
                       "ARROW.scriptType = \"action\";" +
                       "ARROW.testScript = \"\";" +
                       "ARROW.actionScript = \"\";" +
                       "ARROW.onSeeded = function() { " + testLibsJs + runnerJs + " };" + seedJs;

                   Y.Assert.areEqual(result,expectResult);
               },

        'test createDriverJs when the testseed file does not exist with no arrow server running' : function () {
            var driver, testParams={}, called, config={};

            testParams.test = "shanghai-func.js";
            config.testRunner = arrowRoot + '/lib/client/yuitest-runner.js';
            config.testSeed = "test-seed.js";

            driver = new driverClass(config,{});
            var result = driver.createDriverJs(testParams, function (msg) {
                    Y.Assert.areEqual(msg.toString(),"Error: ENOENT, no such file or directory 'test-seed.js'");
                    called = true;
                    });

            Y.Assert.isTrue(called);
            Y.Assert.isFalse(result);
        },

            'test createDriverJs when the testrunner file does not exist with no arrow server running' : function () {
                var driver, testParams={}, called, config={};

                testParams.test = "shanghai-func.js";
                config.testRunner = "test-runner.js";
                config.testSeed = arrowRoot + '/lib/client/yuitest-seed.js'

                driver = new driverClass(config,{});
                var result = driver.createDriverJs(testParams, function (msg) {
                        Y.Assert.areEqual(msg.toString(), "Error: ENOENT, no such file or directory 'test-runner.js'");
                        called = true;
                        });

                Y.Assert.isTrue(called);
                Y.Assert.isFalse(result);
                },

                'test createDriverJs when there is incorrect file path in testparams with no arrow server running' : function () {
                    var driver, testParams={}, called, config;

                    testParams ={
                        test: "shanghai-func.js",
                        lib : arrowRoot + '/lib/common/yui-arrow.js',
                        action : arrowRoot + '/lib/client/qunit-runner.js'
                    };

                    config = {
                        testSeed : arrowRoot + '/lib/client/yuitest-seed.js',
                        testRunner : arrowRoot + '/lib/client/yuitest-runner.js',
                        defaultAppSeed : 'http://yui.yahooapis.com/3.6.0/build/yui/yui-mins.js'
                    };

                    driver = new driverClass(config,{});

                    function getArrowServerBase(){
                          return false;
                     }
                    
                    driver.getArrowServerBase = getArrowServerBase;
                    //incorrect test file path
                    var result = driver.createDriverJs(testParams, function (msg) {
                            Y.Assert.areEqual(msg.toString(),"Error: ENOENT, no such file or directory 'shanghai-func.js'");
                            called = true;
                     });
                     
                    Y.Assert.isTrue(called);
                    Y.Assert.isFalse(result);
                    
                    //incorrect lib file path
                    testParams ={
                        test: arrowRoot + '/tests/unit/lib/controller/default-tests.js',
                        lib : 'test-lib.js',
                        action : arrowRoot + '/lib/client/qunit-runner.js'
                    }; 
                    called = false;
                    var result = driver.createDriverJs(testParams, function (msg) {
                            Y.Assert.areEqual(msg.toString(),"Error: ENOENT, no such file or directory 'test-lib.js'");
                            called = true;
                            });
                    Y.Assert.isTrue(called);
                    Y.Assert.isFalse(result);

                    //incorrect action file path
                    testParams ={
                        lib : arrowRoot + '/lib/common/yui-arrow.js',
                        action : 'test-action.js'
                    };

                    called = false;
                    var result = driver.createDriverJs(testParams, function (msg) {
                            Y.Assert.areEqual(msg.toString(),"Error: ENOENT, no such file or directory 'test-action.js'");
                            called = true;
                    });
                    Y.Assert.isTrue(called);
                    Y.Assert.isFalse(result);
                },

                   'test createDriverJs when all the parameters are correct and arrow server running' : function () {
                       var driver = new driverClass(correctConfig,correctTestParams);

                       function getArrowServerBase(){
                           return true;
                       }

                       function getRemoteUrl(url) {
                           return url;
                       }

                       driver.getArrowServerBase = getArrowServerBase;
                       driver.getRemoteUrl = getRemoteUrl;

                       //scriptType is action and there is test
                       var result = driver.createDriverJs(correctTestParams, function () {});
                       var seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");
                       var runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8");

                       var expectResult = "ARROW = {};" +
                           "ARROW.driver = 'crt';" +
                           "ARROW.autoTest = false;" +
                           "ARROW.testParams = " + JSON.stringify(correctTestParams) + ";" +
                           "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                           "ARROW.testLibs = " + "[\"" + correctTestParams.lib + "\"];" +
                           "ARROW.scriptType = \"action\";" +
                           "ARROW.testScript = " + "\"" + correctTestParams.test + "\";" +
                           "ARROW.actionScript = " + "\"\";" + 
                           "ARROW.onSeeded = function() { " + runnerJs + " };" + seedJs;

                       Y.Assert.areEqual(result, expectResult);

                      //scriptType is action and there is no test
                       testParams = {
                            lib : arrowRoot + '/lib/common/yui-arrow.js',
                            action : arrowRoot + '/lib/client/qunit-runner.js'
                       };

                       result = driver.createDriverJs(testParams, function(){});
                       expectResult = "ARROW = {};" +
                           "ARROW.driver = 'crt';" +
                           "ARROW.autoTest = false;" +
                           "ARROW.testParams = " + JSON.stringify(testParams) + ";" +
                           "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                           "ARROW.testLibs = " + "[\"" + testParams.lib + "\"];" +
                           "ARROW.scriptType = \"action\";" +
                           "ARROW.testScript = " + "\"\";" +
                           "ARROW.actionScript = " + "\"" + testParams.action +  "\";" +
                           "ARROW.onSeeded = function() { " + runnerJs + " };" + seedJs;
                       
                       Y.Assert.areEqual(result, expectResult);

                   },

                      'test createDriverJs when autotest=true, scriptType=test': function() {
                          var testParams = {
                                test: 'test.html', 
                                lib : 'testlib1.js, testlib2.js'
                          };

                          var driver = new driverClass(correctConfig, testParams);
                          function getArrowServerBase(){
                              return true;
                          }

                          function getRemoteUrl(url) {
                              return url;
                          }

                          driver.getArrowServerBase = getArrowServerBase;
                          driver.getRemoteUrl = getRemoteUrl;

                          var result = driver.createDriverJs(testParams, function () {});
                          var seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");
                          var runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8");

                          var expectResult = "ARROW = {};" +
                              "ARROW.driver = 'crt';" +
                              "ARROW.autoTest = true;" +
                              "ARROW.testParams = " + JSON.stringify(testParams) + ";" +
                              "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                              "ARROW.testLibs = " + "[];" +
                              "ARROW.scriptType = \"test\";" +
                              "ARROW.testScript = " + "\"\";" +
                              "ARROW.actionScript = " + "\"\";" + 
                              "ARROW.onSeeded = function() { " + runnerJs + " };" + seedJs;

                          fs.writeFileSync("/Users/aiqin/expDJ.out",expectResult);
                          Y.Assert.areEqual(result, expectResult);
                      },

                      'test createDriverJs when there are multiple Libs, server running and without server' : function () {
                          function getArrowServerBase_Stop(){
                              return false;
                          }

                          //without server running
                          var testParams = {
                                test: arrowRoot + '/tests/unit/lib/controller/default-tests.js',
                                lib : arrowRoot + '/lib/common/yui-arrow.js,' + arrowRoot + '/lib/client/yuitest-console.js',
                                action : arrowRoot + '/lib/client/qunit-runner.js'
                          };

                          var driver = new driverClass(correctConfig, testParams);
                          driver.getArrowServerBase = getArrowServerBase_Stop;

                          var result = driver.createDriverJs(testParams, function(){});
                          var testLibsJs = fs.readFileSync(arrowRoot + '/lib/common/yui-arrow.js', "utf8") +
                              fs.readFileSync(arrowRoot + '/lib/client/yuitest-console.js', "utf8") + 
                              fs.readFileSync(testParams.test, "utf8"),

                              runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8"),
                              seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");

                          expectResult = "ARROW = {};" +
                              "ARROW.driver = 'crt';" +
                              "ARROW.autoTest = false;" +
                              "ARROW.testParams = " + JSON.stringify(testParams) + ";" +
                              "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                              "ARROW.testLibs = [];" +
                              "ARROW.scriptType = \"action\";" +
                              "ARROW.testScript = \"\";" +
                              "ARROW.actionScript = \"\";" +
                              "ARROW.onSeeded = function() { " + testLibsJs + runnerJs + " };" + seedJs;

                          Y.Assert.areEqual(result,expectResult);

                          //with server running
                          function getArrowServerBase_Running(){
                              return true;
                          }

                          function getRemoteUrl(url) {
                              return url;
                          }

                          driver.getArrowServerBase = getArrowServerBase_Running;
                          driver.getRemoteUrl = getRemoteUrl;

                          result = driver.createDriverJs(testParams, function () {});
                          seedJs = fs.readFileSync(correctConfig.testSeed, "utf8");
                          runnerJs = fs.readFileSync(correctConfig.testRunner, "utf8");

                          expectResult = "ARROW = {};" +
                              "ARROW.driver = 'crt';" +
                              "ARROW.autoTest = false;" +
                              "ARROW.testParams = " + JSON.stringify(testParams) + ";" +
                              "ARROW.appSeed = \"" + correctConfig.defaultAppSeed + "\";" +
                              "ARROW.testLibs = " + "[\"" + arrowRoot + '/lib/common/yui-arrow.js' + "\"," + "\"" + arrowRoot + '/lib/client/yuitest-console.js' +  "\"];" +
                              "ARROW.scriptType = \"action\";" +
                              "ARROW.testScript = " + "\"" + testParams.test + "\";" +
                              "ARROW.actionScript = " + "\"\";" + 
                              "ARROW.onSeeded = function() { " + runnerJs + " };" + seedJs;

                          Y.Assert.areEqual(result, expectResult);
                          },

                      'test navigate when the web view url is not correct' : function () {
                         var driver = new driverClass({},{}), called = false;

                         driver.getCrtUrl = getCrtUrl_false;
                         driver.navigate("testcrturl", function (msg) {
                                    called = true;
                                    Y.Assert.areEqual(msg, "Cannot load web view: testcrturl");
                                 });
                         Y.Assert.isTrue(called);
                      },

                     'test navigate when the web view url is correct' : function () {
                         var driver = new driverClass({crtTestServer: "http://localhost:9000/shanghai"},{}), called = false;
                         driver.getCrtUrl = getCrtUrl_true;
                         driver.start(function(msg){ 
                                 Y.Assert.areEqual(msg, "create webdriver successfully");
                                 });

                         function webdriver_navigate(url, callback) {
                             var response = {};
                             response.error = "faked navigate";

                             callback(response);
                         }

                         driver.navigate("testcrturl", function (msg) {
                                 called = true;
                                 Y.Assert.areEqual(msg, null);
                                 });
                         Y.Assert.isTrue(called);

                         called = false;
                         driver.webdriver.navigate = webdriver_navigate;
                         driver.navigate("testcrturl", function (msg) {
                                 called = true;
                                 Y.Assert.areEqual(msg, "faked navigate");
                                 });
                         Y.Assert.isTrue(called);
                     },

                     'test executeTest when createDriverJs return false' : function () {
                         var driver = new driverClass({crtTestServer: "http://localhost:9000/shanghai"},{});
                         var called = false;

                         driver.createDriverJs = createDriverJs_false;
                         driver.executeTest(correctConfig, correctTestParams, function () {
                                 called = true;
                                 });

                         Y.Assert.isFalse(called);
                       },

                     'test executeTest when test is html file and the url is false' : function () {
                          var testParams = {
                                test: arrowRoot + '/lib/client/testHost.html',
                                lib: arrowRoot + '/lib/common/yui-arrow.js'
                          };
                          var driver = new driverClass(correctConfig, testParams);
                          driver.createDriverJs = createDriverJs_true;
                          driver.getCrtUrl = getCrtUrl_false;

                          driver.executeTest(correctConfig, testParams, function(msg){
                                  called = true;
                                  Y.Assert.areEqual(msg, "Cannot load the crt web view: " + arrowRoot + '/lib/client/testHost.html');
                                  });

                          Y.Assert.isTrue(called);
                      },

                     'test executeTest when there is correct page in test parameter while webdriver return false' : function () {
                         var testParams = {
                            page: arrowRoot + '/lib/client/crtTestHost.html', 
                         }
                         var driver = new driverClass({crtTestServer:"http://localhost:9000/shanghai"}, testParams);
                         var called = false;

                         driver.createDriverJs = createDriverJs_true;
                         driver.getCrtUrl = getCrtUrl_true;
                         driver.start(function(msg){
                                    Y.Assert.areEqual(msg, "create webdriver successfully");
                                    called = true;
                                 })
                         Y.Assert.isTrue(called);
                         called = false;

                         function navigate(url, callback){
                             var response = {error: 'test error'};
                             callback(response);
                         }
                         driver.webdriver.navigate = navigate;
                         driver.executeTest(correctConfig, testParams, function (msg) {
                                 called = true;
                                 Y.Assert.areEqual(msg, "test error");
                                 });
                         Y.Assert.isTrue(called);
                     },

                     'test executeTest when there is correct page and the response report is {}' : function () {
                         var testParams = {
                                test: "test.js",
                                page: arrowRoot + '/lib/client/crtTestHost.html'
                         }
                         var driver = new driverClass({crtTestServer:"http://localhost:9000/shanghai"}, testParams);
                         var called = false;

                         driver.createDriverJs = createDriverJs_true;
                         driver.getCrtUrl = getCrtUrl_true;
                         driver.start(function(msg){
                                 Y.Assert.areEqual(msg, "create webdriver successfully");
                                 called = true;
                                 })
                         Y.Assert.isTrue(called);
                         called = false;

                         function executeScript(code, callback) {
                             var response = {};
                             response.report = {};
                             response.cLog = "test client console log";
                             callback(response);
                         } 

                         driver.webdriver.executeScript = executeScript;
                         driver.executeTest(correctConfig, testParams, function (msg) {
                                 called = true;
                                 Y.Assert.areEqual(msg, "invalid YUI test file: test.js");
                                 });
                         Y.Assert.isTrue(called);
                     },

                    'test executeTest when there is correct page and the response report is null' : function () {
                        var testParams = {
                              test: "test.js",
                              page: arrowRoot + '/lib/client/crtTestHost.html'
                        }
                        var driver = new driverClass({crtTestServer:"http://localhost:9000/shanghai"}, testParams);
                        var called = false;

                        driver.createDriverJs = createDriverJs_true;
                        driver.getCrtUrl = getCrtUrl_true;
                        driver.start(function(msg){
                                Y.Assert.areEqual(msg, "create webdriver successfully");
                                called = true;
                                })
                        Y.Assert.isTrue(called);
                        called = false;

                        function executeScript(code, callback) {
                            var response = {};
                            callback(response);
                        } 

                        driver.webdriver.executeScript = executeScript;
                        driver.executeTest(correctConfig, testParams, function (msg) {
                                called = true;
                                Y.Assert.areEqual(msg, "Failed to collect the test report");
                        });
                        Y.Assert.isTrue(called);
                    },

                    'test executeTest when there is correct page and webdriver returns the correct report' : function () {
                        var testParams = {
                                test: "test.js",
                                page: arrowRoot + '/lib/client/crtTestHost.html'
                        }
                        var driver = new driverClass({crtTestServer:"http://localhost:9000/shanghai"}, testParams);
                        var called = false;

                        driver.createDriverJs = createDriverJs_true;
                        driver.getCrtUrl = getCrtUrl_true;
                        driver.start(function(msg){
                                Y.Assert.areEqual(msg, "create webdriver successfully");
                                called = true;
                                })
                        Y.Assert.isTrue(called);
                        called = false;

                        function executeScript(code, callback) {
                            var response = {report: "test report"};
                            callback(response);
                        } 

                        function addReport(report, caps) {
                            return true;
                        }

                        driver.webdriver.executeScript = executeScript;
                        driver.addReport = addReport;
                        driver.executeTest(correctConfig, testParams, function (err, report) {
                                called = true;
                                Y.Assert.areEqual(report, "test report");
                                });
                        Y.Assert.isTrue(called);
                    },

                     'test executeTest when there is correct page and webdriver returns the correct report with minifyJS = true' : function () {
                         var testParams = { 
                                test: "test.js",
                                page: arrowRoot + '/lib/client/crtTestHost.html'
                         }   
                         var driver = new driverClass({crtTestServer:"http://localhost:9000/shanghai"}, testParams);
                         var called = false, minJS = null;

                         function createDriverJs(code, callback){
                             var code = "for (var i = 1; i < 10; ++i) { \n" +
                                        "var boo = 1;\n" + 
                                        "}\n" +
                                        "for (var i = 0; i < 1; ++i) {\n" +
                                        "var boo = 2;\n" +
                                        "}\n";
                             return code;
                         }
                         driver.createDriverJs = createDriverJs;
                         driver.getCrtUrl = getCrtUrl_true;

                         driver.start(function(msg){
                                 Y.Assert.areEqual(msg, "create webdriver successfully");
                                 called = true;
                                 })  
                         Y.Assert.isTrue(called);
                         called = false;

                         function executeScript(code, callback) {
                             if (!minJS) {
                                 minJS = code;
                             }

                             var response = {report: "test report"};
                             callback(response);
                         }   

                         function addReport(report, caps) {
                             return true;
                         }   

                         driver.webdriver.executeScript = executeScript;
                         driver.addReport = addReport;
                         driver.minifyJS = true;
                         driver.executeTest(correctConfig, testParams, function (err, report) {
                                 called = true;
                                 Y.Assert.areEqual(report, "test report");
                                 }); 
                         Y.Assert.isTrue(called);
                         Y.Assert.areEqual(minJS, "for(var i=1;i<10;++i)var boo=1;for(var i=0;i<1;++i)var boo=2");
                     },  


                    'test executeTest when there is no page with coverage' : function () {
                        var testParams = {
                                test: "test.js",
                        },
                        coverageConfig = {
                            crtTestServer : 'http://localhost:9000/shanghai',
                            coverage : true
                        };

                        var driver = new driverClass(coverageConfig, testParams);
                        var called = false, getCoverage = false;

                        driver.createDriverJs = createDriverJs_true;
                        driver.getCrtUrl = getCrtUrl_true;                                                                
                        driver.start(function(msg){
                                Y.Assert.areEqual(msg, "create webdriver successfully");
                                called = true;
                                })
                        Y.Assert.isTrue(called);
                        called = false;

                        function executeScript(code, callback) {
                            var response = {
                                   report: "test report with coverage",
                                   cov : "test coverage"
                            };
                                    
                            callback(response);
                        } 

                        function addReport(report, caps) {
                            return true; 
                        }   

                        function addCoverage(coverage) {
                            getCoverage = true;
                            return true;
                        }

                        driver.webdriver.executeScript = executeScript;
                        driver.addReport = addReport;
                        driver.coverage = require(arrowRoot + '/lib/util/coverage');
                        driver.coverage.addCoverage = addCoverage;
                        driver.executeTest(coverageConfig, testParams, function (err, report) {
                                called = true;
                                Y.Assert.areEqual(report, "test report with coverage");
                                });
                        Y.Assert.isTrue(called);
                        Y.Assert.isTrue(getCoverage);
                    },

             'test executeTest when testParams.lib=false, args.params.lib=true' : function () {
                 var testParams = {
                        test: "test.js",
                 },
                 
                 config = {
                        crtTestServer : 'http://localhost:9000/shanghai'
                 },
                 args = {
                        params : {
                            lib: 'args.params.lib'
                                 }
                 };

                 var driver = new driverClass(config, args);
                 var called = false, lib ="";

                 function createDriverJs (testParams, callback) {
                     lib = testParams.lib;
                     return false;
                 }
                 driver.createDriverJs = createDriverJs;
                 driver.executeTest(correctConfig, testParams, function(){
                         called = true;
                         });

                 Y.Assert.isFalse(called);
                 Y.Assert.areEqual(lib, "args.params.lib");
             },

             'test executeTest when testParams.lib=true, or args.params=false or args.params.lib=false' : function () {
                 var testParams = { 
                        test: "test.js",
                        lib : "testParams.lib"
                 },                               
                 config = {
                        crtTestServer : 'http://localhost:9000/shanghai'
                 },
                 args = {                   
                    params : {
                        lib: 'args.params.lib'
                         }
                 };         

                 var driver = new driverClass(config, args);
                 var called = false, lib ="";

                 function createDriverJs (testParams, callback) {
                     lib = testParams.lib;
                     return false;
                 }
                 driver.createDriverJs = createDriverJs;

                 //testParams.lib = true;
                 driver.executeTest(correctConfig, testParams, function(){
                         called = true;
                         });

                 Y.Assert.isFalse(called);
                 Y.Assert.areEqual(lib, "testParams.lib");

                 //args.params = false;
                 driver = new driverClass(config, {});
                 driver.createDriverJs = createDriverJs;
                 driver.executeTest(correctConfig, {test : 'test.js'}, function(){
                         called = true;
                         });
                 Y.Assert.isFalse(called);
                 Y.Assert.areEqual(lib, undefined);

                 //args.params.lib=false;
                 driver = new driverClass(config, {params : {}});
                 driver.createDriverJs = createDriverJs;
                 driver.executeTest(correctConfig, {test : 'test.js' }, function() {
                         called = true;
                         });
                 Y.Assert.isFalse(called);
                 Y.Assert.areEqual(lib, undefined);
             },
             
             'test getCrtUrl when the url is a valid crt app' : function(){
                 var driver = new driverClass({},{}), result = "";
                
                 var url =  "crt://yahoo.com/yahoo.someapp"; 
                 result = driver.getCrtUrl(url);
                 Y.Assert.areEqual(result, url);
             },

             'test getCrtUrl when the url is the default app url' : function(){
                 var driver = new driverClass({},{}), result = "";
                
                 var url = "lib/client/crtTestHost.html";
                 function getArrowServerBase_true() {
                     return "http://arrowhost:port/arrow/static/";
                 }
                 
                 function getArrowServerBase_false() {
                     return false;
                 }
                 driver.getArrowServerBase = getArrowServerBase_true;
                 result = driver.getCrtUrl(url);
                 Y.Assert.areEqual(result, "http://arrowhost:port/arrow/static/" + url);

                 driver.getArrowServerBase = getArrowServerBase_false;
                 result = driver.getCrtUrl(url);
                 Y.Assert.isFalse(result);

             },
             'test getCrtUrl when the url is a valid http url for browser test' : function(){
                 var driver = new driverClass({},{}), result = "";

                 result = driver.getCrtUrl("http://testpage");
                 Y.Assert.areEqual(result, "http://testpage");
             },

             'test getCrtUrl when the url is a not acceptable url' : function(){
                 var driver = new driverClass({},{}), result = "";
                 result = driver.getCrtUrl("anyurl");
                 Y.Assert.isFalse(result);
             }
        }));

        Y.Test.Runner.add(suite);
},'0.0.1',{requires:['test']});
