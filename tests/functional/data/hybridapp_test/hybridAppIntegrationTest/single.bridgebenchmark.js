YUI().use("node","test","bridge","test-console", "integration-tests-cfg","bridgebenchmark-integration-tests",
        function(Y) { 

        console.log("========successfully load the modules ==========="); 
       
        try { 
        var testRunner = Y.Test.Runner, 
        testConsole = new Y.Test.Console({
                    id : "ytest",
                    filters : {
					pass : true,
					ignore : true
				},
				height: 500,
				render : "#ytest-console"
				}),
	
				button = Y.one("#runTests"),
	
				renderTests = function() {
					var suite = Y.BridgeIntegrationTests,
					tests = Y.one("#tests"),
					testCase,
					o,
					i, l;
	
					for (i = 0, l = suite.items.length; i < l; i++) {
						testCase = suite.items[i];
	
						o = {
							id : testCase.id,
							name : testCase.name
						};
						tests.append(Y.Lang.sub('<label><input type="checkbox" id="{id}"> {name}</label>', o));
					}
				},
	
				runSelectedTests = function() {

                   console.log("========entering the runSelectedTests =========\n");    
					var suite = Y.BridgeIntegrationTests,
					testCase,
					i, l,
					id,
					checkbox;
	
					testConsole.clearConsole();
					testRunner.clear();

                   console.log("=====the suite length is =====" + suite.items.length);    
					for (i = 0, l = suite.items.length; i < l; i++) {
						testCase = suite.items[i];
						id = testCase.id;
						checkbox = Y.one("#" + id);
	
						if (checkbox && checkbox.get("checked")) {
							testRunner.add(testCase);
						}
					}
	
					//testRunner.run();
				};
	
	
				    runSelectedTests();
	
					renderTests();
	
					testRunner.setName("Bridge Integration Tests");
					testRunner.add(Y.BridgeIntegrationTests);
	
				} catch (e) {
						Y.log(e, "error", "bridge-integration-tests");
					}
	}); 
