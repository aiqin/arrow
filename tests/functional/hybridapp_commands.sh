#-------Auto run
#Test click button (using stay=true) and click a link
arrow data/hybridApp_test/hybridApp_descriptor1.json --driver=hybridApp --report=true
# button id is wrong, should prompt error and case fail
arrow data/hybridApp_test/hybridApp_descriptor2.json --driver=hybridApp --report=true
# link id is wrong, should prompt error anc case fail
arrow data/hybridApp_test/hybridApp_descriptor3.json --driver=hybridApp --report=true
# test 2 tests on 1 client, need launch 1 client
arrow data/hybridApp_test/hybridApp_descriptor4.json --driver=hybridApp --report=true
# test 1 test on 1 client, need launch 1 client
arrow data/hybridApp_test/hybridApp_descriptor5.json --driver=hybridApp --report=true
# test input text and verify text
arrow data/hybridApp_test/hybridApp_descriptor6.json --driver=hybridApp --report=true
# test locator using xpath, link
arrow data/hybridApp_test/hybridApp_descriptor7.json --driver=hybridApp --report=true
# function test with --page option
arrow data/hybridApp_test/hybridApp-test-func.js --page=crt://yahoo.com/yahoo.application.oo/index.html --driver=hybridApp --logLevel=debug
# function test with --reuseSession option
arrow data/hybridApp_test/hybridApp-test-func.js --page=crt://yahoo.com/yahoo.application.oo/index.html --driver=hybridApp --reuseSession=true
# function test with --parallel option
arrow data/hybridApp_test/hybridApp-test-func.js --page=crt://yahoo.com/yahoo.application.oo/index.html --driver=hybridApp --parallel=2

#----Need manual start 2 clients
# test 1 test on 2 clients, need launch 2 clients
arrow data/hybridApp_test/hybridApp_descriptor5.json --driver=hybridApp --report=true
# test 2 tests on 2 clients, need launch 2 clients
arrow data/hybridApp_test/hybridApp_descriptor4.json --driver=hybridApp --report=true
