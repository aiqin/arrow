YUI.add("scrollview-paginator",function(b){var c=b.ClassNameManager.getClassName,k="scrollview",a=c(k,"hidden"),n=c(k,"paged"),d=(b.ScrollView)?b.ScrollView.UI_SRC:"ui",e="index",l="scrollX",j="scrollY",i="total",p="host",m="boundingBox",o="contentBox",h="selector",g="flick",f="drag";function q(){q.superclass.constructor.apply(this,arguments);}q.NAME="pluginScrollViewPaginator";q.NS="pages";q.ATTRS={selector:{value:null},index:{value:0,validator:function(r){return r>=0&&r<this.get(i);}},total:{value:0}};b.extend(q,b.Plugin.Base,{optimizeMemory:false,padding:1,_uiEnabled:true,_prevent:new b.Do.Prevent(),initializer:function(s){var v=this,t=v.get(p),r=s.optimizeMemory||v.optimizeMemory,u=s.padding||v.padding;v.padding=u;v.optimizeMemory=r;v._host=t;v._hostOriginalFlick=t.get(g);v._hostOriginalDrag=t.get(f);v.beforeHostMethod("_mousewheel",v._mousewheel);v.beforeHostMethod("_flickFrame",v._flickFrame);v.beforeHostMethod("_onGestureMoveEnd",v._onGestureMoveEnd);v.afterHostMethod("_uiDimensionsChange",v._afterHostUIDimensionsChange);v.afterHostEvent("render",v._afterHostRender);v.afterHostEvent("scrollEnd",v._scrollEnded);v.after("indexChange",v._afterIndexChange);},_afterHostRender:function(t){var w=this,s=w._host,v=w._getPageNodes(),r=v.size(),u=s.get(m);u.addClass(n);w.set(i,r);w._optimize();},_afterHostUIDimensionsChange:function(r){var s=this;s.set(i,s._getPageNodes().size());},_onGestureMoveEnd:function(s){var t=this,r=t.get(e);t.scrollTo(r);},_flickFrame:function(){var u=this,s=u._host,r=s._currentVelocity,t=r<0;if(r){if(t){u.next();}else{u.prev();}}return u._prevent;},_mousewheel:function(u){var v=this,s=v._host,t=u.wheelDelta<0,r=s.get(o);if(r.contains(u.target)){if(t){v.next();}else{v.prev();}u.preventDefault();return v._prevent;}},_scrollEnded:function(s){var t=this,r=t.get(e);t._optimize();this._uiEnable();},_afterIndexChange:function(s){var t=this,r=s.newVal;if(s.src!==d){t.scrollTo(r);}},_optimize:function(){var w=this,u=w._host,s=w.optimizeMemory,t=u._scrollsVertical,r=w.get(e),v;if(!s){return false;}v=w._getStage(r);w._showNodes(v.visible);w._hideNodes(v.hidden);w.scrollTo(r,0);},_getStage:function(v){var z=this,A=z._host,x=z.padding,y=x+1+x,w=z._getPageNodes(),t=z.get(i),r,s,u;r=Math.max(v-x,0);if(r+y>t){r=r-(r+y-t);}s=w.splice(r,y);u=w;return{visible:s,hidden:u};},_showNodes:function(s){var t=this._host,r=t.get(o);if(s){s.removeClass(a).setStyle("display","");}},_hideNodes:function(r){var s=this._host;if(r){r.addClass(a).setStyle("display","none");}},_uiEnable:function(){var t=this,s=t._host,r=!t._uiEnabled;if(r){t._uiEnabled=true;s.set(g,t._hostOriginalFlick);s.set(f,t._hostOriginalDrag);}},_uiDisable:function(){var s=this,r=s._host;s._uiEnabled=false;r.set(g,false);r.set(f,false);},_getPageNodes:function(){var v=this,s=v._host,r=s.get(o),t=v.get(h),u=t?r.all(t):r.get("children");return u;},next:function(){var t=this,r=t.get(e),s=r+1;if(t._uiEnabled){t.set(e,s);}},prev:function(){var t=this,r=t.get(e),s=r-1;if(t._uiEnabled){t.set(e,s);}},scrollTo:function(v,u,x){var B=this,C=B._host,r=C._scrollsVertical,t=(r)?j:l,z=B._getPageNodes(),s=r?C._startClientY:C._startClientX,y=r?C._endClientY:C._endClientX,A=s-y,w;u=(u!==undefined)?u:q.TRANSITION.duration;x=(x!==undefined)?x:q.TRANSITION.easing;B._showNodes(z.item(v));w=z.item(v).get(r?"offsetTop":"offsetLeft");C.set(t,w,{duration:u,easing:x});}});q.TRANSITION={duration:300,easing:"ease-out"};b.namespace("Plugin").ScrollViewPaginator=q;},"@VERSION@",{requires:["plugin","classnamemanager"]});