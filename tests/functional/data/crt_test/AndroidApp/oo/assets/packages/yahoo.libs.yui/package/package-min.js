YUI.add("package",function(e,t){var n=e.namespace("Package");n.ERROR={},n._serviceId="sPackage",n.getUpdateState=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"getUpdateState",i,{success:t,failure:r})},n.blockUpdates=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"blockUpdates",i,{success:t,failure:r})},n.applyUpdatesBlocker=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"applyUpdatesBlocker",i,{success:t,failure:r})},n.ignoreApplyUpdatesReload=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"ignoreApplyUpdatesReload",i,{success:t,failure:r})},n.subscribe=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"subscribe",i,{success:t,failure:r})},n.unsubscribe=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"unsubscribe",i,{success:t,failure:r})},n.queryPackages=function(t,r,i){return e.Bridge.invokeMethod(n._serviceId,"queryPackages",i,{success:t,failure:r})},n.clearWatch=function(t,n,r){e.Bridge.cancelMethod(t,n,r)}},"@VERSION@",{requires:["bridge"]});