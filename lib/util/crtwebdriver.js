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

crtWebdriver.prototype.quit = function (callback) {
    if (this.controller) {
        this.controller.close();
        this.logger.info("closing the controller");
    }

    if (callback) {
        callback(null);
    }
}
crtWebdriver.prototype.executeScript = function (script, callback) {
    this.controller.execute(this.sessionId, script, callback);
}

crtWebdriver.prototype.navigate = function (url, callback) {
    this.logger.info("[Step] Navigate:url:"+url);
    this.controller.navigate(this.sessionId, url, callback);
}


crtWebdriver.prototype.clickAndStay = function (locator, callback, errback) {

    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\"); answerFn({});\n";
    this.logger.info("[Step] Click and stay:locator:"+locator);
    this.controller.execute(this.sessionId, code, callback,errback);
}

crtWebdriver.prototype.clickAndNavigate = function (locator, callback,errback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    this.logger.info("[Step] Click and navigate:locator:"+locator);
    this.controller.executeAndNavigate(this.sessionId, code, callback,errback);

}

crtWebdriver.prototype.typeText = function (locator, value, callback,errback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doType(\"" + locator +"\",\""+value+ "\"); answerFn({});\n";
    this.logger.info("[Step] Type text:locator:"+locator+":value:"+value);
    this.controller.execute(this.sessionId, code, callback,errback);

}
module.exports = crtWebdriver;
