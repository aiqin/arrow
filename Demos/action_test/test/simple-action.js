
YUI.add("simple-action", function (Y) {

    console.log("action initialized");

    Y.namespace("arrow").action = {
        setUp: function (callback) {
            console.log("action setUp");
            callback();
        },

        execute: function() {
            console.log("action executed");
            window.location.href = "http://www.yahoo.com";
        }
    }

}, "0.1", {requires: []});

