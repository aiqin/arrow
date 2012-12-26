// open the page index.html?test=1
// click the link
                    //Y.one('a').simulate('click');
//get the url window.location.href verify url is string and url is inner.html
//we can also verify following things mode: Y.one('#mode').get('innerHTML');
//h1: Y.one('h1').get('innerHTML');
YUI({ useBrowserConsole:true}).use("node","test", function(Y){
        var suite = new Y.Test.Suite("CRT page test");;
                 suite.add(new Y.Test.Case({
                "test get text value" : function () {
                       var linkValue = this.testParams["textValue"];
                       Y.Assert.areEqual(linkValue, Y.one('#text1').get('value'));
                }
                }));
        Y.Test.Runner.add(suite);
        });

