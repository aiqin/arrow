#Overview

As crt test supports those app running in browser and in emulator/devices, so in order to run in different test environment, need update application baseurl in test descriptor and test commands in crt_commands.sh
--- for app running in browser, the base url like: http://localhost:10000/arrow/static/{app path}
--- for app running in emulator/device, the base url like: crt://yahoo.com/yahoo.application.oo

#How to update the baseurl once on all test descriptor json files
run "./replaceUrl.js --url=<your url>" to replace all the url in the *descriptor*.json file

#Run test on Android sample app 
**Pre-conditions:**
 1. Installed ADT, refer to http://developer.android.com/sdk/installing/bundle.html 
 2. A android emulator with SD card, API Level =14 and platform 4.0, checked the avds you have by command 'android avd'
 3. update the ip address in the app's each .html file, for example ./AndroidApp/oo/assets/packages/yahoo.application.oo/*.html

**Step1**: Launch shanghai server by 'shanghai-server --host={ip}', and open 'http://localhost:9000' to open the shanghai server remote console.

**Step2**: Launch arrow server by 'arrow_server'

**Step3**: Open Eclipse, right click on blank in 'Project Explorer', select Import -> Existing Projects into Workspace-> select {arrow install folder}/tests/functional/data/crt_test/AndroidApp/oo
or 
cd your project root directory, run "android update project --path . --subprojects  --target 1 --name oo" then "ant clean debug", "cd bin", "android install *.apk"

**Step4**: Open terminal and run 'adb emulator -avd {avd name}', check device status by 'adb devices'

**Step5**: In eclipse, select 'com.yahoo.platform.crt.activity.CocktailsRTActivity' and right click, select Run as -> Android application to launch application in emulator

**Step6**: Check shanghai server remote console to make sure there is a client in 'Select target' drop down list

**Step7**: run "./replaceUrl.js --url=<your url>" if you need change app path.

**Step8**:Go to /tests/functional, run './crt_commands.sh' or a single command like 
'arrow data/crt_test/crt-test-func.js --page=crt://yahoo.com/yahoo.application.oo/index.html --driver=crt --logLevel=debug'

#Run test in app running in browser

**Step1**: Launch shanghai server by 'shanghai-server --host={ip}', and open 'http://localhost:9000' to open the shanghai server remote console.

**Step2**: Launch arrow server by 'arrow_server'

**Step3**: Launch browser, and open app test page like 'http://localhost:10000/arrow/static/..../browserTestApp/index.html'

**Step4**: Check shanghai server remote console to make sure there is a client in 'Select target' drop down list

**Step5**: run "./replaceUrl.js --url=<your url>" if you need change app path.

**Step6**: Go to /tests/functional, run './crt_commands.sh' or a single command like 
'arrow data/crt_test/crt-test-func.js --page=http://localhost:10000/arrow/static/...../browserTestApp/index.html --driver=crt --logLevel=debug'

