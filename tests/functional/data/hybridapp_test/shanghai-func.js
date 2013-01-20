// open the page index.html?test=1
// click the link
                    //Y.one('a').simulate('click');
//get the url window.location.href verify url is string and url is inner.html
//we can also verify following things mode: Y.one('#mode').get('innerHTML');
//h1: Y.one('h1').get('innerHTML');
YUI({ useBrowserConsole:true}).use("node","test", function(Y){
        var suite = new Y.Test.Suite("hybridApp page test");
        suite.add(new Y.Test.Case({
                "test innerhtml value" : function () {
                       var linkValue = this.testParams["linkValue"];
                       var h1Value = this.testParams["h1Value"];
                       Y.Assert.areEqual(linkValue, Y.one('a').get('innerHTML'));
                       Y.Assert.areEqual(h1Value, Y.one('h1').get('innerHTML'));
                }
                }));
        Y.Test.Runner.add(suite);
        });

