/**
 * this file will be injected into test App and used to register app to shanghai server.
 */
var es = document.getElementsByTagName("script");
var loadurl;
for (var i = 0; i < es.length; i++)
    {
        if (typeof(es[i].src)==="string" && es[i].src.indexOf('arrow/lib/util/crtinjecttest.js')>0)
        {
            loadurl = es[i].src;
        }
    }
/**
 * extract arrow host and port from current url, which is used to load selenium core related framework to test app
 */
var booturl = loadurl.substring(0,loadurl.indexOf('arrow/static'));
var begin = booturl.indexOf("//");
var end = booturl.indexOf(":", 6); //get second : before port
var host= booturl.substring(begin+2, end); //get host
var url=loadurl+'/../../../third_party/'; // go to selenium core framework path in arrow src code
document.write('<' + 'script src="' + url +'selenium/javascript/webdriver-bootstrap.js' + '"></' + 'script>');
document.write('<' + 'script src="' + url +'selenium/javascript/deps.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/htmlutils.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-logging.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-api.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-browserbot.js' + '"></' + 'script>');
document.write('<' + 'script type="'+'text/javascript'+'">'+'goog.require('+"'bot.dom'"+');'+'goog.require('+"'core.firefox'"+');'+'goog.require('+"'core.text'"+');'+'goog.require('+"'core.events'"+');'+'</script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-browserdetect.js' + '"></' + 'script>');
document.write('<' + 'script src="' + 'http://'+host+':9000/boot?sid='+ window.localStorage.sessionId + '"></' + 'script>');
   