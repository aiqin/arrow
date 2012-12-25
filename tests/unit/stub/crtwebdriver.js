var log4js = require("log4js");
var shanghaiController = require('shanghai').Controller;
var util = require("util");

function crtWebdriver(config){
    this.logger = log4js.getLogger("crtWebdriver");
    this.config = config;
    this.controller = null;    
}

crtWebdriver.prototype.buildWebDriver = function (sid, callback)
{
 var self = this;
 self.sessionId=sid;
 // this.controller = this.createController(); 
 // this.controller.connect();
 this.actions = [];
 // this.controller.on('local.ready', function() {
    // callback();
 // });
           
}

crtWebdriver.prototype.createController = function () {
    //TBD: here I need tell whehter shanghai server is living, change the seleniumHost to what??
    var baseurl = this.config["crtTestServer"];
    var debug = this.config["logLevel"] ? true : false; 

    return new shanghaiController({baseUrl: baseurl, nodebug:!debug});
}

crtWebdriver.prototype.quit = function (controller) {
    if (this.controller) {
        this.controller.close();
        this.logger.info("closing the controller");
    }
}
crtWebdriver.prototype.executeScript = function (script, callback) {
    this.controller.execute(this.sessionId, script, callback);
}

crtWebdriver.prototype.navigate = function (url, callback) {
    // this.controller.navigate(this.sessionId, url, callback);
    this.actions.push({"name": "navigate","sessionId":this.sessionId, "url":url, "callback":callback});
}

crtWebdriver.prototype.clickAndStay = function (locator, callback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    this.actions.push({"name": "clickAndStay","sessionId":this.sessionId, "code":code, "callback":callback()});
}

crtWebdriver.prototype.clickAndNavigate = function (locator, callback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    
    this.actions.push({"name": "clickAndNavigate","sessionId":this.sessionId, "code":code, "callback":callback()});
}

module.exports = crtWebdriver;
