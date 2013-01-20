/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var http = require("http");
var log4js = require("log4js");
var Arrow = require("../interface/arrow");
var fs = require('fs');

function TestSession(config, args, sessionId) {
    this.logger = log4js.getLogger("TestSession");
    this.args = args;
    this.config = config;
    this.sessionId = sessionId;
    if (args.driver) {
        this.driverName = args.driver.toLowerCase().trim();
    }
    if (args.controller) {
        this.controller = args.controller.toLowerCase().trim();
    }
    this.testConfig = args.config;
    
    this.retryCount = 0;
    if (args.params) {
        this.testParams = args.params;
    } else {
        this.testParams = {};
    }
}

TestSession.prototype.setup = function (callback) {
    var DriverClass = null;

    if (!this.driverName) {
        if (this.controller === "hybridapp") {
            this.driverName = "hybridapp";
        } else if (this.controller || this.testParams.page || this.args.browser || this.sessionId) {
            this.driverName = "selenium";
        } else {
            this.driverName = "nodejs";
        }
    }

    // if descriptor has defined driver, that overrides everything else.
    if (this.testParams.driver) {
        this.driverName = this.testParams.driver;
    }

    this.driverName = this.driverName.toLowerCase();
    this.logger.debug("driver: " + this.driver + ", browser: " + this.args.browser);

    if ("selenium" === this.driverName) {
        this.logger.info("Using selenium driver");
        DriverClass = require("../driver/selenium");
    } else if ("nodejs" === this.driverName) {
        this.logger.info("Using node driver");
        DriverClass = require("../driver/node");
    } else if ("hybridapp" === this.driverName) { 
        this.logger.info("Using hybridApp driver");
        DriverClass = require("../driver/hybridapp");
    } else {
        this.logger.fatal("ERROR :" + this.driverName + " is not a supported test driver, Please provide \"selenium\" or \"nodejs\" or \"hybridApp\" as driver.");
        callback("ERROR :" + this.driverName + " is not a supported test driver, Please provide \"selenium\" or \"nodejs\" or \"hybridApp\" as driver.");
        return;
    }

    this.driver = new DriverClass(this.config, this.args);
    this.driver.setSessionId(this.sessionId);

    //setting default page
    if (!this.testParams.page) {
        if ("hybridapp" === this.driverName) {
            this.testParams.page = this.config["defaultHybridAppTestHost"];
        } else {
            this.testParams.page = this.config["defaultTestHost"];
        }
    }

    callback(null);
};

TestSession.prototype.runTest = function (callback) {
    var self = this,
        arrow = Arrow.getInstance(),
        rep,
        arrReport,
        isFail = false;

    if (this.args.testName) {
        self.logger.info("Running test: " + this.args.testName);
    }

    self.setup(function (error) {
        if (error) {
            //callback(error);
            self.retryTest(callback, error);
            //return;
        } else {
            self.driver.start(function (error) {
                if (error) {
                    //callback(error);
                    self.retryTest(callback, error);
                    //return;
                } else {
                    arrow.runController(self.controller, self.testConfig, self.testParams, self.driver, function () {
                        if (self.isFail()) {
                            self.retryTest(callback);
                        } else {
                            self.driver.stop(callback);
                        }
                    });
                }
            });
        }
        return;
    });

};

TestSession.prototype.isFail = function () {
    var arrReport,
        rep,
        j,
        k,
        isFail = false,
        self = this,
        results,
        testJson;

    //checking if there was any failure
    rep = self.driver.getReports();
    if (rep.scenario) {
        arrReport = rep.scenario;
    } else {
        arrReport = rep.results;
    }

    if (arrReport) {
        if (arrReport.length === 0) {
            isFail = true;
        } else {
            for (j = 0; j < arrReport.length; j = j + 1) {
                if (rep.scenario) {
                    results = arrReport[j].results;
                    for (k = 0; k < results.length; k = k + 1) {
                        testJson =  results[k];
                        if (testJson.type === "report" && testJson.failed > 0) {
                            isFail = true;
                        }
                    }
                } else {
                    testJson = arrReport[j];
                    if (testJson.type === "report" && testJson.failed > 0) {
                        isFail = true;
                    }
                }
            }
        }
    }

    return isFail;

};


TestSession.prototype.retryTest = function (callback, error) {
    var self = this;
    // checking if retries are left

    if (global.retryCount - self.retryCount > 0) {
        self.retryCount += 1;
        self.logger.info("Retrying Test, Try # " + self.retryCount);
        self.driver.stop(function() {
            self.runTest(callback);
        });
    } else {
        self.recordFailure();
        if (error) {
            callback(error);
        } else {
            self.driver.stop(callback);
        }
    }
};


TestSession.prototype.recordFailure = function () {

    var webdriver = this.driver.webdriver;

    if (webdriver) {

        webdriver.session_.then(function (val) {
            //recording screenshot
            webdriver.takeScreenshot().then(function(img) {
                fs.writeFileSync("wd-" + val.id + ".png", new Buffer(img, 'base64'));
            });

            //recording html source
            webdriver.getPageSource().then(function(src) {
                fs.writeFileSync("wd-" + val.id + ".html", src);
            });
        });
    }
};

module.exports = TestSession;

