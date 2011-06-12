////MODULE_NAME = "research.widget";
////console.log(MODULE_NAME+" loaded!");

//research.widget = {
//    init: function() {

//    },

//    defaults: {
//        width: 320
//    },

//    //  Initialize widget UI
//    createUI: function() {
//          var self = research.widget;

//        self.cache.box = $('<div>', {
//            id: 'research'
//        });

//        var boxContainer = $('<div>', {
//            id: 'research-container'
//        }).appendTo(document.body);

//    },

//    //  Open the research widget
//    open: function() {
//        if (!this.cache.box)
//            this.createUI();

//        this.attachListeners();
//        this.setPosition(research.options.position);

//        if (research.style.cache.selector) {
//            this.enable();
//        }
//        else {
//            this.disable();
//        }

//        setTimeout(function() {
//            research.widget.updateHeight();
//        }, 0);

//        this.setMode();
//        this.cache.box.show();

//    },

//    //  Close research widget
//    close: function() {
//        this.detachListeners();
//        this.cache.box.hide();
//    },


//};
