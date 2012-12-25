/*
 * Copyright (c) 2012-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

YUI.add('crt-tests', function(Y, NAME) {

    var path = require('path'), arrowRoot = path.join(__dirname, '../../../..'), crtController = require(arrowRoot + '/lib/controller/crt.js'), StubDriver = require(arrowRoot + '/tests/unit/stub/driver.js');
    StubWdApp = require(arrowRoot + '/tests/unit/stub/crtwebdriver.js');
    suite = new Y.Test.Suite(NAME), A = Y.Assert, self = this;

    function validateLocator(sessionId, params) {
        var wasCalled = false, config = {}, wdApp = new StubWdApp(), driver = new StubDriver(), crt;
        driver.webdriver = new StubWdApp(self.config);
        driver.webdriver.buildWebDriver(sessionId);
        crt = new crtController(config, params, driver);
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

        'test click button locator' : function() {
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

        'test click link locator' : function() {
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
        'test no value' : function() {
            var actions = validateLocator("1356313637866-211-client", {
                page : 'http://localhost:8000/index.html'
            });
            A.isTrue("\"value\" parameter is required" === self.callbackMsg, 'Must have value');
        }
        // 'test no stay for clicking button' : function() {
// 
        // },
        // 'test no click button' : function() {
// 
        // }
       
    }));

    Y.Test.Runner.add(suite);
}, '0.0.1', {
    requires : ['test']
});

