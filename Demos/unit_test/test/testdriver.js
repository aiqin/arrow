YUI({useBrowserConsole:true}).use('node', 'console', 'test', function (Y) {

    Y.namespace("example.test");

    Y.example.test.DataTestCase = new Y.Test.Case({
        /*
         * Sets up data that is needed by each test.
         */
        setUp : function () {
            this.data = {
                name: "test",
                year: 2007,
                beta: true
            };
        },

        testName : function () {
            var Assert = Y.Assert;
            Assert.isObject(this.data);
            Assert.isString(this.data.name);
            Assert.areEqual("test", this.data.name);
		},
    });

    Y.example.test.ExampleSuite = new Y.Test.Suite("Example Suite");
    Y.example.test.ExampleSuite.add(Y.example.test.DataTestCase);
    Y.Test.Runner.add(Y.example.test.ExampleSuite);
});

