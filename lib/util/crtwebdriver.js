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
 this.controller = this.createController(); 
 this.controller.connect();
 this.controller.on('local.ready', function() {
    callback();
 });
           
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
    this.controller.navigate(this.sessionId, url, callback);
}

crtWebdriver.prototype.clickAndStay = function (locator, callback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"id=" + locator + "\");\n";

    this.controller.execute(this.sessionId, code, callback);
}

crtWebdriver.prototype.clickAndNavigate = function (locator, callback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"id=" + locator + "\");\n";
    
    this.logger.debug("------ do clickAndNavigate for sessions ID=["+this.sessionId+"]");
    this.controller.executeAndNavigate(this.sessionId, code, callback);
}

module.exports = crtWebdriver;
