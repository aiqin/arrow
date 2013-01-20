var log4js = require("log4js");
var shanghaiController = require('shanghai').Controller;
var util = require("util");

function hybridAppWebdriver(config){
    this.logger = log4js.getLogger("hybridAppWebdriver");
    this.config = config;
    this.controller = null;    
}

hybridAppWebdriver.prototype.buildWebDriver = function (sid, callback)
{
 var self = this;
 self.sessionId=sid;
 callback("create webdriver successfully");
 this.actions = [];
}

hybridAppWebdriver.prototype.createController = function () {
    //TBD: here I need tell whehter shanghai server is living, change the seleniumHost to what??
    var baseurl = this.config["hybridAppTestServer"];
    var debug = this.config["logLevel"] ? true : false; 

    return new shanghaiController({baseUrl: baseurl, nodebug:!debug});
}

hybridAppWebdriver.prototype.quit = function (callback) {
    callback("quit from webdriver successfully");
}
hybridAppWebdriver.prototype.executeScript = function (script, callback) {
    this.controller.execute(this.sessionId, script, callback);
}

hybridAppWebdriver.prototype.navigate = function (url, callback) {
    // this.controller.navigate(this.sessionId, url, callback);
    this.actions.push({"name": "navigate","sessionId":this.sessionId, "url":url, "callback":callback});
    callback({});
}

hybridAppWebdriver.prototype.clickAndStay = function (locator, callback,errcallback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    this.actions.push({"name": "clickAndStay","sessionId":this.sessionId, "code":code, "callback":callback()});
}

hybridAppWebdriver.prototype.clickAndNavigate = function (locator, callback,errcallback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doClick(\"" + locator + "\");\n";
    
    if(locator.indexOf("now")!==-1){//invalid locator
         this.actions.push({"name": "clickAndNavigate","sessionId":this.sessionId, "code":code, "callback":callback(),"errcallback":errcallback("execError: Unrecognised locator type: 'now'")});
    }else{
         this.actions.push({"name": "clickAndNavigate","sessionId":this.sessionId, "code":code, "callback":callback()});   
    }

}
hybridAppWebdriver.prototype.typeText = function (locator, value, callback,errback) {
    var code = "var browserbot = new MozillaBrowserBot(window);\n" + 
        "var selenium = new Selenium(browserbot);\n" +
        "selenium.doType(\"" + locator +"\",\""+value+ "\"); answerFn({});\n";
     this.logger.info("[Step] Type text:locator:"+locator+":value:"+value);
     this.actions.push({"name": "typeText","sessionId":this.sessionId, "code":code, "callback":callback()});   

}
module.exports = hybridAppWebdriver;
