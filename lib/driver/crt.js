/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var fs = require("fs");
var util = require("util");
var path = require("path");
var log4js = require("log4js");
var Driver = require("../interface/driver");
var coverage = require("../util/coverage");
var uglifyParser = require("uglify-js").parser;
var uglify = require("uglify-js").uglify;
/**
 * Driver wrapping web driver
 */
function CrtDriver(config, args) {
    Driver.call(this, config, args);

//    console.log("config is " + util.inspect(config) + "\n args is " + util.inspect(args) + "\n");
    this.logger = log4js.getLogger("CrtDriver");
}

util.inherits(CrtDriver, Driver);

CrtDriver.wdAppPath = "../util/crtwebdriver";

/**
 * Driver interface method
 * check whether the url is crt app url
 */

CrtDriver.prototype.getCrtUrl = function (url) {
    var patt1=/crt:\/\/yahoo.com\//g;
    var patt2=/lib\/client\/crtTestHost\.html/g;
    var patt3=/http/g;

    if (url.match(patt1)) {
        return url;
    } else if (url.match(patt2)) {
       var serverBase = this.getArrowServerBase();
       if (false === serverBase) {
           return false;
       } else {
           this.logger.warn("try to run the test on the browser instead of CRT app");
           return serverBase + url;
       }
    } else if (url.match(patt3)) {
      return url;
    }else {
        this.logger.warn("wrong page, overwrite the page with --page ");
        return false;
    }
}
/**
 * Driver interface method
 * Start the driver before it can execute test. Perform task such as connecting to shanghai server
 *
 * @param callback function to call when the driver is ready to be used, with errorMsg if failed
 */
CrtDriver.prototype.start = function (callback) {
    var self = this,
        wdHubHost,
        WdAppClass = require(CrtDriver.wdAppPath),
        wdApp,
        errorMsg;

        wdHubHost = self.config["crtTestServer"];

    if (!wdHubHost) {
        self.errorCallback(self.logger, "Could not determine shanghai server", callback);
        return;
    }

    self.logger.info("Connecting to shanghai: " + wdHubHost);

    self.webdriver  = new WdAppClass(self.config);
    self.webdriver.buildWebDriver(this.sessionId, callback);
};

/**
 * Driver interface method
 * Tidy up the driver
 *
 * @param callback
 */
CrtDriver.prototype.stop = function (callback) {
    if (this.sessionId) { // we were not given a session id
        this.webdriver.quit(callback);
    } else {
        if (callback) { callback(null); } 
    }
};

/**
 * creates javascript that will be injected in the browser to run the test
 *
 * @private
 *
 * @param testParams parameters for this test
 * @params callback function to call if there was an error
 *
 * @return injectable javascript or false on error
 */
CrtDriver.prototype.createDriverJs = function (testParams, callback) {

    var self = this,
        logger = this.logger,
        scriptType = "test",
        testJs,
        testJsUrl = "",
        actionJs,
        actionJsUrl = "",
        testParamsJs,
        appSeedUrl,
        seed,
        runner,
        seedJs,
        runnerJs,
        libs,
        arrLib,
        testLibsUrl = "[]",
        testLibsJs = "",
        testLibs = [],
        lib,
        autoTest = false,
        serverBase,
        driverJs,
        i;

    testJs = testParams.test;
    actionJs = testParams.action;
    if (!testJs && !actionJs) {
        self.errorCallback(logger, "The test or the action js must be specified", callback);
        return false;
    }
    if (actionJs) {
        scriptType = "action";
    }

    appSeedUrl = self.config["defaultAppSeed"];
    seed = self.config["testSeed"];
    runner = self.config["testRunner"];

    try {
        seedJs = fs.readFileSync(seed, "utf-8");
        runnerJs = fs.readFileSync(runner, "utf-8");
    } catch (e) {
        callback(e);
        return false;
    } 

    libs = testParams.lib;
    if (libs) {
        arrLib = libs.split(",");
    } else {
        arrLib = [];
    }

    testParamsJs = JSON.stringify(testParams);

    // html tests run themselves
    if (testJs && (".html" === path.extname(testJs))) {
        autoTest = true;
    } else {
        // if arrow server is not running, we inject the entire script else inject the URL and 
        // let the browser pull in from the arrow server (helps with debugging and injection size
        // is manageable).
        serverBase = self.getArrowServerBase();
        if (false === serverBase) {

            try {
                for (i = 0; i < arrLib.length; i += 1) {
                    lib = arrLib[i];
                    if (0 === lib.length) { continue; }
                    self.logger.info("Loading dependency: " + lib);
                    testLibsJs += fs.readFileSync(lib, "utf-8");
                }

                if (testJs) {
                    self.logger.info("Loading test: " + testJs);
                    testLibsJs += fs.readFileSync(testJs, "utf-8");
                } else {
                    self.logger.info("Loading action: " + actionJs);
                    testLibsJs += fs.readFileSync(actionJs, "utf-8");
                }
            } catch (e) {
                callback(e);
                return false;
            }
        } else {
            for (i = 0; i < arrLib.length; i += 1) {
                lib = arrLib[i];
                if (0 === lib.length) { continue; }
                self.logger.info("Loading dependency: " + lib);
                testLibs.push(self.getRemoteUrl(lib));
            }
            testLibsUrl = JSON.stringify(testLibs);

            if (testJs) {
                self.logger.info("Loading test: " + testJs);
                testJsUrl = self.getRemoteUrl(testJs);
            } else {
                self.logger.info("Loading action: " + actionJs);
                actionJsUrl = self.getRemoteUrl(actionJs);
            }
        }
    }

    driverJs =
        "ARROW = {};" +
        "ARROW.driver = 'crt';" + 
        "ARROW.autoTest = " + autoTest + ";" +
        "ARROW.testParams = " + testParamsJs + ";" +
        "ARROW.appSeed = \"" + appSeedUrl + "\";" +
        "ARROW.testLibs = " + testLibsUrl + ";" +
        "ARROW.scriptType = \"" + scriptType + "\";" +
        "ARROW.testScript = \"" + testJsUrl + "\";" +
        "ARROW.actionScript = \"" + actionJsUrl + "\";" +
        "ARROW.onSeeded = function() { " + testLibsJs + runnerJs + " };" + seedJs;

    this.logger.trace("Driver js: " + driverJs);
    return driverJs;
};


/**
 * Driver interface method, called by controllers
 *
 * @param page
 * @params callback function to call once navigated
 */
CrtDriver.prototype.navigate = function (page, callback) {
    var self = this,
        logger = this.logger,
        webdriver = this.webdriver,
        url;

    self.logger.info("Loading page: " + page);
    
    // local paths need to be served via test server
       url = self.getCrtUrl(page);
       self.logger.info("In crt driver, navigate to url="+url);
    if (false === url) {
        self.errorCallback(logger, "Cannot load web view: " + page, callback);
    } else {
    webdriver.navigate(url, function (response){
             if (typeof(response.error) === undefined) {
                            callback(null);
               } else {
                         callback(response.error);
               }
     });
    } 
};

/**
 * Driver interface method, called by controllers
 *
 * @param testConfig values from the config section in the descriptor ycb
 * @param testParams parameters for this test
 * @params callback function to call at the end of the test with errorMsg
 */
//TBD: shall we need this, we didn't do the implementation yet
CrtDriver.prototype.executeAction = function (testConfig, testParams, callback) {
 /*   var self = this,
        logger = this.logger,
        webdriver = this.webdriver,
        actionJs,
        page,
        driverJs,
        retryCount = 0,
        url;

    actionJs = testParams.action;
    page = testParams.page;
    if (!testParams.lib && self.args.params && self.args.params.lib) { testParams.lib = self.args.params.lib; }
    self.testCallback = callback; // save it so that async wd exception can be reported back

    driverJs = this.createDriverJs(testParams, callback);
    if (false === driverJs) {
        return;
    }

    function collectTestReport() {
        retryCount += 1;
        logger.debug("Waiting for the test report, attempt: " + retryCount);
        webdriver.executeScript("return ARROW.testReport;").then(function (report) {

            if (report && JSON.stringify(report) !== "{}") {
                self.addReport(report, caps);
                showYUIConsoleLog();
                callback(null, report);

            } else if (retryCount > CrtDriver.maxAttempt) {
                showYUIConsoleLog();
                self.errorCallback(logger, "Failed to collect the test report", callback);
            } else {
                setTimeout(collectTestReport, CrtDriver.attemptInterval);
            }
        });
    }

    function showYUIConsoleLog() {

        webdriver.executeScript("return ARROW.consoleLog;").then(function (cLog) {
            if (cLog) {
                self.logger.debug("Debug Messages from Browser Console :" + "\n" + cLog);
            }
        });
    }

    function initTest() {
        webdriver.executeScript(driverJs).then(function () {
            setTimeout(collectTestReport, CrtDriver.attemptInterval);
        });
    }

    webdriver.session_.then(function (val) {
        logger.debug("Selenium session id: " + val.id);
        if (!val.id) {
            self.errorCallback(logger, "Unable to get a valid session, check your selenium config", callback);
            return;
        }

        caps = val.capabilities;
    });


    // in case of html test, we need to load the test as a page
    if (".html" === path.extname(testJs)) {
        page = path.resolve("", testJs);
    }

    if (page) {
        self.logger.info("Loading page: " + page);

        // local paths need to be served via test server
        url = self.getRemoteUrl(page);
        if (false === url) {
            self.errorCallback(logger, "Cannot load a local file without arrow_server running: " + page, callback);
        } else {
            webdriver.get(url).then(function () {
                initTest();
            });
        }
    } else {
        initTest();
    }*/
};

CrtDriver.prototype.executeTest = function (testConfig, testParams, callback) {
        var self = this,
            logger = this.logger,
            webdriver = this.webdriver,
            testJs,
            page,
            caps = [],
            driverJs,
            url;

        testJs = testParams.test;
        page = testParams.page;                                                               
        
        if (!testParams.lib && self.args.params && self.args.params.lib) { testParams.lib = self.args.params.lib; }
        self.testCallback = callback; // save it so that async wd exception can be reported back           

        driverJs = this.createDriverJs(testParams, callback);                                 
        if (false === driverJs) {                                                             
            return;
        }

      if (self.minifyJS) {
          driverJs = uglifyParser.parse(driverJs); // parse code and get the initial AS
          driverJs = uglify.ast_mangle(driverJs); // get a new AST with mangled names
          driverJs = uglify.ast_squeeze(driverJs); // get an AST with compression optimizations
          driverJs = uglify.gen_code(driverJs); // compressed code here* 
          this.logger.debug("Minified Driver js: " + driverJs);   
      }

      function compositScript(answerString) {
          var code = "(function () {\n" +
              "YUI().use('node', function (Y) {\n" + 
              "Y.on('domready', function () {\n"  +
              "(function (Y, answer ) { answer(\n" + 
              answerString + 
              ");}(Y, answer, client));\n" + 
              "});\n" +  
              "});\n" + 
              "}());"
            
              return code;
      }

      //TBD: I don't test the code coverage part yet.
      function collectTestReport(report) {
          if (report && JSON.stringify(report) !== "{}") {
                    self.addReport(report, caps);                                            
                    showYUIConsoleLog(function () {
                            if (self.config.coverage) {
                                try {
                                    webdriver.executeScript(compositScript("{cov: window.__coverage__}"), function (response){ coverage.addCoverage(response.cov);
                                        callback(null, report);
                                        });
                                } catch (e) {
                                   self.logger.debug("Error :" + e.toString());
                                   callback(null, report);
                                }
                            } else {
                                callback(null, report);
                            }
                        });
                 } else if (JSON.stringify(report) === "{}") {
                     showYUIConsoleLog(function (){
                             self.errorCallback(logger, "invalid YUI test file: " + testJs, callback);
                             });
                 } else {
                     showYUIConsoleLog(function(){
                             self.errorCallback(logger, "Failed to collect the test report", callback);
                             });
                 } 
        }       


            function showYUIConsoleLog(callback) {
             try {
                var code = compositScript("{cLog: ARROW.consoleLog}");
                webdriver.executeScript(code, function(response){
                        if (response.cLog) {
                            self.logger.debug("Debug Messages from browser Console :" + "\n" + response.cLog);
                            callback();
                        } else {
                            self.logger.debug("No debug log found in browser");
                            callback();
                        }  
                        });
                  } catch (e) {
                      self.logger.trace("Error: " + e.toString());
                      callback();
                  }
            }   


            function initTest() {
                webdriver.executeScript(driverJs, function(response){
                        collectTestReport(response.report);
                });
            }   

            // we need check whether the webdriver has the sesion id
        
            // in case of html test, we need to load the test as a page
     if (".html" === path.extname(testJs)) {
                page = path.resolve("", testJs);
            }

     if (page) {
        self.logger.info("Loading page: " + page);

        // local paths need to be served via test server
        url = self.getCrtUrl(page);
        if (false === url) {
            self.errorCallback(logger, "Cannot load the crt web view: " + page, callback);
        } else {
            webdriver.navigate(url, function (response) {
                    if (typeof(response.error) === "undefined") {
                        initTest(); 
                    } else {
                        callback(response.error);
                    }
                    });
        }   
     } else {
         initTest();
     }   

};
module.exports = CrtDriver;

