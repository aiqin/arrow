/*
 * Copyright (c) 2012-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('crt-controller-tests', function(Y, NAME) {

    var path = require('path'), arrowRoot = path.join(__dirname, '../../../..'), 
    crtController = require(arrowRoot + '/lib/controller/crt.js')
    suite = new Y.Test.Suite(NAME), A = Y.Assert, driverClass = require(arrowRoot + '/lib/driver/crt.js'),self = this;

    driverClass.wdAppPath = arrowRoot + '/tests/unit/stub/crtwebdriver.js';

    function validateLocator(sessionId, params) {
        var wasCalled = false,config, crt; 
        config = {crtTestServer:"http://localhost:9000/shanghai"};
        driver = new driverClass(config,{});
        driver.sessionId=sessionId;
        driver.start(function(msg){
                           console.log(msg);
                    });
        crt = new crtController({}, params, driver);
        crt.execute(function(msg) {
            if (msg === null) {
                self.callbackMsg = "null";
            }else if(msg!==null && msg!==undefined){
                self.callbackMsg=msg;
            }
            wasCalled = true;

        })
        A.isTrue(wasCalled, 'The execution callback function should be called.')
        return driver.webdriver.actions;
    }


    suite.add(new Y.Test.Case({

        'test click button' : function() {
            var locator = "id=adjust";
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doClick(\"" + locator + "\");\n";
            var actions = validateLocator("1356313637866-211-client", {
                value : "adjust",
                click : true,
                stay : true
            });
            A.isTrue('clickAndStay' === actions[0].name, 'click button should use clickAndStay method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for clicking button should be the same');
            A.isTrue("null" === self.callbackMsg, 'callback is not called');
        },
        'test click link' : function() {
            var locator = "id=testlink";
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doClick(\"" + locator + "\");\n";
            var actions = validateLocator("1356313637866-211-client", {
                value : "testlink",
                click : true
            });
            A.isTrue('clickAndNavigate' === actions[0].name, 'click a link shuold use clickAndNavigate method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for clicking button should be the same');
            A.isTrue("null" === self.callbackMsg, 'callback is not called');
        },

        'test input text' : function() {
            var locator = "//input[@id='text1']", value = "hello"
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doType(\"" + locator + "\",\"" + value + "\"); answerFn({});\n";
            var actions = validateLocator("1356313637866-211-client", {
                "using" : "xpath",
                "value" : "//input[@id='text1']",
                "text" : "hello"
            });
            A.isTrue('typeText' === actions[0].name, 'type text shuold use typeText method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for typing text should be the same');
            A.isTrue("null" === self.callbackMsg, 'callback is not called');
        },
        
        'test no value' : function() {
            var actions = validateLocator("1356313637866-211-client", {
                page : 'http://localhost:8000/index.html'
            });
            A.isTrue("\"value\" parameter is required" === self.callbackMsg, 'Must have value');
        },
        'test using strategy - link' : function() {
            var locator = "link=Inner page";
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doClick(\"" + locator + "\");\n";
            var actions = validateLocator("1356313637866-211-client", {
                using : "link",
                value : "Inner page",
                click : true
            });
            A.isTrue('clickAndNavigate' === actions[0].name, 'click a link shuold use clickAndNavigate method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for clicking button should be the same');
            A.isTrue("null" === self.callbackMsg, 'callback is not called');
        },
        'test using strategy - xpath' : function() {
            var locator = "//a[@id='testlink']";
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doClick(\"" + locator + "\");\n";
            var actions = validateLocator("1356313637866-211-client", {
                using : "xpath",
                value : "//a[@id='testlink']",
                click : true
            });
            A.isTrue('clickAndNavigate' === actions[0].name, 'click a link shuold use clickAndNavigate method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for clicking button should be the same');
            A.isTrue("null" === self.callbackMsg, 'callback is not called');
        },
        'test using invalid strategy' : function() {
            var locator = "now=//a[@id='testlink']";
            var sessionId = "1356313637866-211-client";
            var code = "var browserbot = new MozillaBrowserBot(window);\n" + "var selenium = new Selenium(browserbot);\n" + "selenium.doClick(\"" + locator + "\");\n";
            var actions = validateLocator("1356313637866-211-client", {
                using : "now",
                value : "//a[@id='testlink']",
                click : true
            });
            A.isTrue('clickAndNavigate' === actions[0].name, 'click a link shuold use clickAndNavigate method');
            A.isTrue(sessionId === actions[0].sessionId, 'sessionId pass wrong');
            A.isTrue(code === actions[0].code, 'selenium code for clicking button should be the same');
            A.isTrue("execError: Unrecognised locator type: 'now'" === self.callbackMsg, 'callback is not called');
        },
        'test no click and text' : function() {
            var actions = validateLocator("1356313637866-211-client", {
                using : "xpath",
                value : "//a[@id='testlink']"
            });
            A.isTrue("No support params 'click' or 'text' found" === self.callbackMsg, 'callback is not called');
        }
       
    }));

    Y.Test.Runner.add(suite);
}, '0.0.1', {
    requires : ['test']
});

