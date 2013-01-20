YUI.applyConfig({
    filter: ((window.location.search.match(/[?&]debug=([^&]+)/) || [])[1]) ? "debug" : "min",

    aliases : {
        "bridge" : ["transport"]
    },

    groups : {
        crtlib : {
            base: "/yahoo.crt.lib/",
            modules : {
                "bridge-dom" : {},
                "transport" : {
                    requires: ["bridge-delegate"]
                }
            }
        }
    }
});
