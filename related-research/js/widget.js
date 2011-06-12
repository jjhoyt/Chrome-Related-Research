MODULE_NAME = "research.widget";
console.log(MODULE_NAME+" loaded!");

research.widget = {
    init: function() {

    },

    defaults: {
        width: 320
    },

    //  Initialize widget UI
    createUI: function() {
          var self = research.widget;

        self.cache.box = $('<div>', {
            id: 'research'
        });

        var boxContainer = $('<div>', {
            id: 'research-container'
        }).appendTo(document.body);

    },

};
