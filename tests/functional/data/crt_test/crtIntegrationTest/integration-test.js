YUI({
modules : {
     'compass' : {
        fullpath : '../yahoo.libs.yui/compass/compass.js'
     },
     'connectionmonitor' : {
        fullpath: '../yahoo.libs.yui/connectionmonitor/connectionmonitor.js'
     },
     'accelerometer' : {
        fullpath: '../yahoo.libs.yui/accelerometer/accelerometer.js'
     },
     'package' : {
        fullpath: '../yahoo.libs.yui/package/package.js'
     },
     'handle' : {
        fullpath: '../yahoo.libs.yui/handle/handle.js'
     },
     'proxy' : {
        fullpath: '../yahoo.libs.yui/proxy/proxy.js'
     },
     'substitute' : {
        fullpath: '../yahoo.libs.yui/substitute/substitute.js'
     },
     'db' : {
        fullpath: '../yahoo.libs.yui/db/db.js'
     },
     'login' : {
        fullpath: '../yahoo.libs.yui/login/login.js'
     },
     'notification' : {
        fullpath : '../yahoo.libs.yui/notification/notification.js'
     },
     /*'geo' : {
        fullpath : '../yahoo.libs.yui/geo/geo.js'
      },
        'camera' : {
        fullpath : '../yahoo.libs.yui/camera/camera.js'
     }*/
}
    }).use("node", "integration-tests-cfg", "bridge", 
        "test", "test-console", "oop",
        "notification","transition","compass","connectionmonitor","package","handle","proxy","substitute","db","login","accelerometer",/*"geo","camera",*/
       "bridge-integration-tests",
        "idl-integration-tests",
        "compass-integration-tests",
        "connectionmonitor-integration-tests",
        "testservice-integration-tests",
        "logging-integration-tests",
        "package-integration-tests",
        "notification-integration-tests",
        "perf-integration-tests",
        "proxy-integration-tests",
        "login-integration-tests",
        "accelerometer-integration-tests",
        "db-integration-tests",
//      "bridgebenchmark-integration-tests",
//   "geo-integration-tests",
//       "camera-integration-tests",
        function(Y) {

            console.log("==========finish loading hte modules ============");
            //bridge-base is not included yet
	var socket = null,
	platform  = Y.IntegrationTestsConfig.platform,
	test_modules =  Y.IntegrationTestsConfig[platform+"_test_modules"],
	yetie = Y.IntegrationTestsConfig.yeti_enable,
	yetis = Y.IntegrationTestsConfig.yeti_server;
	
	// If use yeti to test, add other needed modules
	if(yetie === true) {
		test_modules.push("io");
	test_modules.push("dump");
	test_modules.push("json-parse");
	test_modules.push("cookie");
	}


//	YUI().use( test_modules,
//		function(Y) {
	
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
	
					var suite = Y.BridgeIntegrationTests,
					testCase,
					i, l,
					id,
					checkbox;
	
					testConsole.clearConsole();
					testRunner.clear();
	
					for (i = 0, l = suite.items.length; i < l; i++) {
						testCase = suite.items[i];
						id = testCase.id;
						checkbox = Y.one("#" + id);
	
						if (checkbox && checkbox.get("checked")) {
							testRunner.add(testCase);
						}
					}
	
				//	testRunner.run();
				},
	
				/**
				* this function bind with Test.Runner.COMPLETE_EVENT event
				* when test complete, use this method to send result to yeti server
				*/
				complete = function(data) {
					var resultsJunit = Y.Test.TestFormat.JUnitXML(data.results);
					data.results.junit = resultsJunit;
					socket.json.emit("results", data.results);
				};
	
				/* If not use Yeti to test */
				if( yetie === false ) {
					button.on("click", function() {
						button.set("disabled", true);
						runSelectedTests();
					});
	
					renderTests();
	
					testRunner.setName("Bridge Integration Tests");
					testRunner.add(Y.BridgeIntegrationTests);
					testRunner.on("complete", function() {
						button.set("disabled", false);
					});
	
//					testRunner.run();
				}
				else {
					var yeticapture = yetis+"/capture";
	
					Y.Get.script(
						[yetis+"/socket.io/socket.io.js"],
						{
							onSuccess: function(o) {
	
								setTimeout( function(){
									var agentId = Y.Cookie.get("yeti-agent");
	
									// connect to yeti server
									socket = io.connect(yeticapture);
	
									// register with yeti server
									socket.json.emit("register", {
										agentId: agentId,
										ua: Y.UA
									});
	
									// when get 'ready' message from yeti
									socket.on("ready", function (newId) {
										agentId = newId;
										Y.Cookie.set("yeti-agent", newId, {
											path: "/",
											expires: new Date("May 10, 2029")
										});
									});
	
									// when get 'navigate' message from yeti
									// 1. bind complete event with function
									// 2. start test
									socket.on("navigate", function (testfile) {
										testRunner.setName("Bridge Service Integration Tests");
										testRunner.add(Y.BridgeIntegrationTests);
										testRunner.subscribe(testRunner.COMPLETE_EVENT, complete);
//										testRunner.run();
									});
	
									}, 1000 );
								}
							});
						}
	
					} catch (e) {
						Y.log(e, "error", "bridge-integration-tests");
					}
	
	//			});
	});
