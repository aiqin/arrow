YUI.add("cache-plugin",function(b){function a(e){var d=e&&e.cache?e.cache:b.Cache,f=b.Base.create("dataSourceCache",d,[b.Plugin.Base]),c=new f(e);f.NS="tmpClass";return c;}b.mix(a,{NS:"cache",NAME:"cachePlugin"});b.namespace("Plugin").Cache=a;},"@VERSION@",{requires:["plugin","cache-base"]});