/*global YUI */
/*
    represents an application service exposed by the ychromeRT bridge.
 */
YUI.add('app-service', function (Y) {
    var NS = Y.namespace('foo');
    NS.adjustHeader = function () {
        var node = Y.one('h1');
        if (node) {
            node.set('innerHTML', "hello from foo!");
        }
    };
    NS.adjustHeaderAgain = function () {
        var node = Y.one('h1');
        if (node) {
            node.set('innerHTML', "hello from foo (second time)!");
        }
    };
    NS.fooMethod = function () {
        return 'this is a foo';
    };
}, 0.1, { requires: ['dom'] });

