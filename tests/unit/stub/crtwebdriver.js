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
 callback("create webdriver successfully");
 this.actions = [];
}

crtWebdriver.prototype.createController = function () {
    //TBD: here I need tell whehter shanghai server is living, change the seleniumHost to what??
    var baseurl = this.config["crtTestServer"];
    var debug = this.config["logLevel"] ? true : false; 

    return new shanghaiController({baseUrl: baseurl, nodebug:!debug});
}

crtWebdriver.prototype.quit = function (callback) {
    callback("quit from webdriver successfully");
}
crtWebdriver.prototype.executeScript = function (script, callback) {
    this.controller.execute(this.sessionId, script, callback);
}

crtWebdriver.prototype.navigate = function (url, callback) {
    // this.controller.navigate(this.sessionId, url, callback);
    this.actions.push({"name": "navigate","sessionId":this.sessionId, "url":url, "callback":callback});
}

crtWebdriver.prototype.clickAndStay = function (locator, callback,errcallback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    this.actions.push({"name": "clickAndStay","sessionId":this.sessionId, "code":code, "callback":callback()});
}

crtWebdriver.prototype.clickAndNavigate = function (locator, callback,errcallback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    
    if(locator.indexOf("now")!==-1){//invalid locator
         this.actions.push({"name": "clickAndNavigate","sessionId":this.sessionId, "code":code, "callback":callback(),"errcallback":errcallback("execError: Unrecognised locator type: 'now'")});
    }else{
         this.actions.push({"name": "clickAndNavigate","sessionId":this.sessionId, "code":code, "callback":callback()});   
    }

}
crtWebdriver.prototype.typeText = function (locator, value, callback,errback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doType(\"" + locator +"\",\""+value+ "\"); answerFn({});\n";
     this.logger.info("[Step] Type text:locator:"+locator+":value:"+value);
     this.actions.push({"name": "typeText","sessionId":this.sessionId, "code":code, "callback":callback()});   

}
module.exports = crtWebdriver;
