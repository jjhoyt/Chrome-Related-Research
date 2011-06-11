// Handles actions triggered from the right click menu
//
related-research.contextmenu = {
    cache: {
        el: null
    },

    initialize: function() {
        this.attachListeners();
    },

    attachListeners: function() {
        $(document.body).bind('contextmenu', function(e) {
            related-research.contextmenu.cache.el = e.target;
        });
    },

    openWidget: function() {
        if (related-research.contextmenu.cache.el && related-research.contextmenu.cache.el.nodeType == 1)
        {
            related-research.open();
            related-research.select(related-research.contextmenu.cache.el);
        }
    }

};
