// Handles actions triggered from the right click menu
//
//
MODULE_NAME = "research.contextmenu";
console.log(MODULE_NAME+" loaded!");

research.contextmenu = {
    cache: {
        val: null
    },

    initialize: function() {
        this.attachListeners();
    },

    attachListeners: function() {
        $(document.body).bind('contextmenu', function(e) {
            research.contextmenu.cache.val = window.getSelection();
        });
    },

    openWidget: function() {
//        if (research.contextmenu.cache.val{
//        {
            research.open();
//        }
        console.log("OpenWidget reached!");
    }

};
