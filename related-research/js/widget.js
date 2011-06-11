related-research.widget = {
    init: function() {

    },

    defaults: {
        width: 320
    },

    //  Initialize widget UI
    createUI: function() {
          var self = related-research.widget;

        self.cache.box = $('<div>', {
            id: 'related-research'
        });

        var boxContainer = $('<div>', {
            id: 'related-research-container'
        }).appendTo(document.body);

    },

};
