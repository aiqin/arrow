* How to setup the integration test app env? 
    1. install the android sdk and simulator
       * if you install the SDK directly, see http://developer.android.com/sdk/index.html
       * if you installed it through eclipse, see http://developer.android.com/sdk/installing/installing-adt.html. i.e. install ADT plugin ADT_plugin - https://dl-ssl.google.com/android/eclipse/"
    2. add the adb and android sdk path to the system path in your .bash_profile and run "source .bash_profile"
    3. upload your .ssh/id_rsa.pub to github https://git.corp.yahoo.com/cocktails/CocktailsRT
    4. clone the project from: git clone git@git.corp.yahoo.com:cocktails/CocktailsRT
    5. cd {gitbase}/core/android/test/  run "ant local-setup" and then run "ant copy-packages"
    6. cd {gitbase}/core/android/test/SmokeTest/assets/packages/

* How to run the integration test
    1. run the command: android create avd -f -n "hybridApp_arrow" -t android-14 -c 512M
    2. run the command: "emulator -avd hybridApp_arrow" to bring up the simulator.
    3. replace the url in index.html "http://192.168.1.104:9000/injected_code/hybridappinjecttest.js", i.e. change the ip to shanghai server ip.
    4. copy index.html, runcmd, integration-test.js, single.bridgebenchmark.js, to the folder: {gitbase}/core/android/test/SmokeTest/assets/packages/yahoo.application.ychromertApp
    5. at folder {gitbase}/core/android/test/, run "deploy-debug" to deploy the app to the simulator
    6. find the app on the simulator, click the app to launch it.
    7. run ./runcmd to launch the integration test with arrow

* Notes
    1. change the content in {gitbase}/core/android/test/SmokeTest/asserts/packages/yahoo.application.ychromertApp and redeploy the app will change the app content.
    2. BE CAUTION: redo local-setup will delete all the content in yahoo.application.ychromeRTApp folder.
    3. run "adb logcat" to see the android simulator logs so that we can debug the hybrid app
    4. geo and camera API do not work
