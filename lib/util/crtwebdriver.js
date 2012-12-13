var log4js = require("log4js");
var shanghaiController = require('shanghai').Controller;
var util = require("util");

function crtWebdriver(config){
    this.logger = log4js.getLogger("crtWebdriver");
    this.config = config;
    this.controller = null;    
}

crtWebdriver.prototype.buildWebDriver = function (callback,sid)
{
 var self = this;
 self.sessionId=sid;
 this.controller = this.createController(); 
 this.controller.connect();
 callback();
           
}

crtWebdriver.prototype.createController = function () {
    //TBD: here I need tell whehter shanghai server is living, change the seleniumHost to what??
    var baseurl = this.config["seleniumHost"];
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
    var self = this;
    var controller = this.controller;
     var sid = this.sessionId;

    this.controller.execute(sid, script, callback);
}

crtWebdriver.prototype.navigate = function (url, callback) {
    callback(null);
     var sid = this.sessionId;
   this.controller.navigate(sid, url, callback);
}

crtWebdriver.prototype.clickAndStay = function (locator, callback) {
    var sid = this.sessionId;

    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"id=" + locator + "\");\n";

    this.controller.execute(sid, code, callback);
}

crtWebdriver.prototype.clickAndNavigate = function (locator, callback) {
    var sid = this.sessionId;
    
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"id=" + locator + "\");\n";
    this.logger.debug("------ do clickAndNavigate for sessions ID=["+sid+"]");
    this.controller.executeAndNavigate(sid, code, callback);
}

module.exports = crtWebdriver;
