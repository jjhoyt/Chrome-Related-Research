/**
  * research
  *
 **/

MODULE_NAME = "research";
console.log(MODULE_NAME+" loaded!");

var research = {

    status: false,

    options: {
        useShortcutKey: true,
        shortcutKey: 77, // 77 is keycode for 'm'
        shortcutMetaKey: 'alt',
        mode: 'Basic',
        position: 'Right',
    },

    initialize: function(options) {
        this.style.initialize();
        this.setOptions(options);
        this.contextmenu.initialize();
    },

    setOptions: function(options) {
        for (option in options) {
            this.options[option] = options[option];
        }
    },

    // toggle research status
    toggle: function() {
        if (this.status === true)
            this.close();
        else
            this.open();
    },

    open: function() {
        this.attachListeners();
        this.widget.open();
        this.status = true;
        this.chrome.setIcon(true);
    },

    close: function() {
        research.widget.close();
        research.status = false;
        research.chrome.setIcon(false);
        research.detachClickListener();
    },

    attachListeners: function() {
        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mousedown', this.onMouseDown, true);
        document.addEventListener('click', this.onMouseClick, true);
    },

    detachListeners: function() {
        document.removeEventListener('mousemove', this.onMouseMove, true);
        document.removeEventListener('mousedown', this.onMouseDown, true);
    },

    detachClickListener: function() {
        document.removeEventListener('click', this.onMouseClick, true);
    },

    shouldClose: function(el) {
        if (!research.status ||
            research.page.isVisible ||
        {
            return false;
        }
        return true;
    }

};
