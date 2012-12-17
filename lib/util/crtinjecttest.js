var es = document.getElementsByTagName("script");
var loadurl;
for (var i = 0; i < es.length; i++)
    {
        if (typeof(es[i].src)==="string" && es[i].src.indexOf('arrow/lib/util/crtinjecttest.js')>0)
        {
            loadurl = es[i].src;
        }
    }
var booturl = loadurl.substring(0,loadurl.indexOf('arrow/static'));
var url=loadurl+'/../../../third_party/';
document.write('<' + 'script src="' + url +'selenium/javascript/webdriver-bootstrap.js' + '"></' + 'script>');
document.write('<' + 'script src="' + url +'selenium/javascript/deps.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/htmlutils.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-logging.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-api.js' + '"></' + 'script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-browserbot.js' + '"></' + 'script>');
document.write('<' + 'script type="'+'text/javascript'+'">'+'sessionId='+"''"+'; goog.require('+"'bot.dom'"+');'+'goog.require('+"'core.firefox'"+');'+'goog.require('+"'core.text'"+');'+'</script>');
document.write('<' + 'script type='+'"text/javascript" src="' + url + 'selenium/javascript/selenium-core/scripts/selenium-browserdetect.js' + '"></' + 'script>');
document.write('<' + 'script src="' + 'http://localhost:9000/boot?sid='+ window.localStorage.sessionId + '"></' + 'script>');
   