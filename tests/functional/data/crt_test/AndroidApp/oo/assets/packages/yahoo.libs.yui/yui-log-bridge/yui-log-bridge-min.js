YUI.add("yui-log-bridge",function(e,t){var n="sLogging",r="bridge-base",i="log",s={off:0,critical:1,error:2,warn:3,info:4,debug:5,trace:6},o=s.info;e.after("yui:log",function(t){var u=s[t.cat]||o;r!==t.src&&e.Bridge&&e.Bridge.invokeMethod(n,i,{message:t.msg,component:t.src,severity:u})})},"@VERSION@",{condition:{trigger:"bridge-base",when:"after"},requires:["yui-log","event-custom-base","bridge-base"]});