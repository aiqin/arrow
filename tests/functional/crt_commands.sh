#Test click button (using stay=true) and click a link
#arrow data/crt_test/crt_descriptor1.json --driver=crt --report=true
# button id is wrong, should prompt error and case fail
#arrow data/crt_test/crt_descriptor2.json --driver=crt --report=true
# link id is wrong, should prompt error anc case fail
#arrow data/crt_test/crt_descriptor3.json --driver=crt --report=true
# test 2 tests on 2 clients, need launch 2 clients
#arrow data/crt_test/crt_descriptor4.json --driver=crt --report=true
# test 2 tests on 1 client, need launch 1 client
#arrow data/crt_test/crt_descriptor4.json --driver=crt --report=true
# test 1 test on 2 clients, need launch 2 clients
#arrow data/crt_test/crt_descriptor5.json --driver=crt --report=true
# test 1 test on 1 client, need launch 1 client
#arrow data/crt_test/crt_descriptor5.json --driver=crt --report=true
# test input text and verify text
#arrow data/crt_test/crt_descriptor6.json --driver=crt --report=true
# test locator using xpath, link
arrow data/crt_test/crt_descriptor7.json --driver=crt --report=true
