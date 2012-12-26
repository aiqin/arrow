#About baseurl
If you want to run test for app in emulator,
 - update 'baseurl' in *descriptor*.json with format like 'crt://yahoo.com/{application folder name}, e.g. crt://yahoo.com/yahoo.application.oo, yahoo.application.oo is the base url of your application.

If you want to run test for app in browser,
 - update 'baseurl' in *descriptor*.json with format like 'http://localhost:10000/arrow/static/{file path}', this uses arrow server to load app.
