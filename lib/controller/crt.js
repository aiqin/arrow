/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var util = require("util");
var log4js = require("log4js");
var Controller = require("../interface/controller");

function CrtController(testConfig, testParams, driver) {
    Controller.call(this, testConfig, testParams, driver);

    this.logger = log4js.getLogger("CrtController");
}

util.inherits(CrtController, Controller);

CrtController.prototype.execute = function (callback) {
    var self = this,
        config = this.testConfig,
        params = this.testParams,
        logger = this.logger,
        webdriver,
        locator,
        strategy,
        target,
        stay,
        elem;

    webdriver = self.driver.getWebDriver(callback);
    if (!webdriver) {
        callback("Crt controller is only supported for the crt driver");
        return;
    }
    
    target = params["value"];
    click = params["click"];

    if (!target) {
        callback("\"value\" parameter is required");
        return;
    }

/*    strategy = params["using"];
    if (!strategy) {
        strategy = "css";
    }
*/ //TBD: no use for crt?

    /**            
     * @param: stay
     * @purpose: passed, override default behavior of click requiring new page load
     * (for in-page interactions)
     * @example: click on an element, to open a menu                                      
     *                                                                                    
     * @usage:                                                                            
     {                                                                            
     "controller": "locator",                                                  
     "params": {                                                               
     "value": ".yom-menu-switch",                                          
     "click" : true,                                                       
     "stay" : true                                                         
     }                                                                         
     }                                                                             
     */                                                                                   
    stay = params["stay"];                                                                
    if (!stay) {                                                                          
        stay = false;                                                                     
    }                       

    function done(response) {
           self.logger.info("step done.");
           if (typeof(response.error) === undefined) {
               callback(null);
           } else {
               callback(response.error);
           }   
    }

    if (true === params["click"]) {
        if (stay) {
            webdriver.clickAndStay(target, done);
        } else {
            webdriver.clickAndNavigate(target, done);
        }
    }
};

module.exports = CrtController;

