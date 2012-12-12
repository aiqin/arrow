/*
 *  * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 *   */
/*jslint bitwise: true, browser: true, nomen: true, regexp: true, sloppy: true, white: true */
//YUI.namespace('Arrow.Test');
YUI.add("login-tests", function (Y) {

        var node = Y.one(document.body),
        suite = new Y.Test.Suite("logintests");

        suite.add(new Y.Test.Case({

                'test validate question content': function() {
                },

                'test validate answer title': function() {
                }
                }));

        Y.Test.Runner.add(suite);
        }, "0.1", { requires: ["event", "node", "node-event-simulate", "test", "test-console"]});

