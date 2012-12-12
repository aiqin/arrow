/*global YUI, window */
YUI().add('tc1', function (Y) {
        Assert = Y.Assert;

        Y.Test.Runner.add(new Y.Test.Case({
                "test navigation to inner": function () {
                var that = this,
                linkClicker,
                hrefGetter;

                linkClicker = new Fn(function (Y) {
                    Y.one('a').simulate('click');
                    })

                hrefGetter = new Fn(function (Y, answer) {
                    answer({
url: window.location.href,
mode: Y.one('#mode').get('innerHTML'),
h1: Y.one('h1').get('innerHTML')
}); 
                    })

                page.navigate('index.html?test=1', function () {
                    page.executeAndNavigate(linkClicker, function () {
                        page.execute(hrefGetter, function (obj) {
                            //that.resume(function () {
                            Assert.isObject(obj, 'Payload was not an object');
                            Assert.isTrue(typeof obj.url === 'string', 'URL was not a string');
                            Assert.isObject(obj.url.match(/inner\.html/));
                            // });
                            }); 
                        }); 
}); 
     //this.wait();
    }   
 }));
}, 0.1, { requires: [ 'test','node-event-simulate','node']});

/*
 * This the skeleton of a basic func test for a multi-tab module
 * It delegates actual testing to test-lib.js, which performs the actual assertions
 */
YUI({ useBrowserConsole: true }).use("arrow-test-tabview", function(Y) {

    // Get the tab view
    var tabid = "#things";
    var tabNode = Y.one(document.body).one(tabid);

    //Get access to test-lib.js
    var tabTest = Y.Arrow.Test.TabView;

    //Create a test suite and name it "TabView unit test suite"
    var suite = new Y.Test.Suite("TabView functional test suite");
    
    /*
     * Add a new test, with three validations to the suite
     * We are going to use the "validateStructure" and "validateSeelection" methods
     * in "media-test-tabview" for the actual validation. 
     * Note, the values we are passing are relevant to our "mock" page (testMoke.html)
     */
    suite.add(new Y.Test.Case({
        "test tab structure": function() {
            tabTest.validateStructure(tabNode, ["#tab1", "#tab2", "#tab3"], ["#mod1", "#mod2", "#mod3"]);
        },
        "test tab selection": function() {
           tabTest.validateSelection(tabNode, "#tab2", "#mod2");
           tabTest.validateSelection(tabNode, "#tab1", "#mod1");
        }
    }));

    //Never "run" the tests, simply add them to the suite. Arrow takes care of running them
    Y.Test.Runner.add(suite);
});

