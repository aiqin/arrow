/*global YUI */
/* represents a test service service that is not used by the ychromeRT app
    but is provided only for testing purposes, assuming that there will
    somehow be a caller that will call it
*/
YUI.add('test-service', function (Y) {
    var NS = Y.namespace('bar');
    NS.barMethod = function () {
        return 'this is a bar';
    };
}, 0.1, { requires: [] });

