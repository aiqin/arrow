YUI.add('transport', function(Y) {

  Y.Bridge = new Y.BridgeBase({type:"delegate"});

}, '@VERSION@' ,{requires:['bridge-delegate']});
