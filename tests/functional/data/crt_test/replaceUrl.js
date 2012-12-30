#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    util = require('util'),
    nopt = require("nopt");

var knownOpts = { 
    "url" : [String, null],
    "help" :[String, null]
    },
    shortHands = {};

var argv = nopt(knownOpts, shortHands, process.argv, 2);
//console.log("====the argv is =====" + util.inspect(argv));

var currentUrl = "";
if (argv.help){
    showHelp();
    process.exit(0);
} else if (argv.url) {
    if (argv.url === "true") {
        //use the default one
        console.log("warn: the default arrow url will be used");
        var serverStatus = path.join(__dirname, "../../../.." + "/tmp/arrow_server.status"),
                defaultUrl = fs.readFileSync(serverStatus, "utf8");
                    currentUrl = defaultUrl + "/arrow/static" + __dirname + "/testApp";
    } else {
       //use the user input one.
        currentUrl = argv.url;
    }
} else {
        console.log("warn: the default arrow url will be used");
            var serverStatus = path.join(__dirname, "../../../.." + "/tmp/arrow_server.status"),
                                defaultUrl = fs.readFileSync(serverStatus, "utf8");
                                currentUrl = defaultUrl + "/arrow/static" + __dirname + "/testApp";
}

//console.log("==== the baseUrl to replace with is: " + currentUrl); 
var replaceUrl = currentUrl.replace(/\//g,"\\/");

var environment = process.env;
environment.URL = replaceUrl;
var envObj = {};
    envObj.env = environment;

var exec = require('child_process').exec;

exec('sed -i -e "s/http:.*testApp/\"${URL}\"/g" crt*.json', envObj, function(error, stdout, stderr){
        if (error) {
            console.log("===the error is ===" + error + "\n");
            console.log("replace the url failed, please replace them manually");
        } else {
            console.log("replace the url with " + currentUrl + " successfully");
        }
    });

function showHelp(){
    console.log("The correct usage are: \n       './replaceUrl.js --help'\n or \n       './replaceUrl.js --url=exampleUrl'");
}
