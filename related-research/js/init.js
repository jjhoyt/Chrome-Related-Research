///**
//  * This content script initializes research
// **/

//// callback for request sent to background.html in research.chrome.fetchOptions()
//function initialize(response) {
////    research.initialize(response.options);
//    attachListeners();
//}

//function attachListeners() {
//    document.addEventListener('keydown', function(e) {

//        if (research.options.useShortcutKey && e.keyCode == research.options.shortcutKey)
//        {
//            if (research.options.shortcutMetaKey === 'ctrl' && e.ctrlKey
//              || research.options.shortcutMetaKey === 'shift' && e.shiftKey
//              || research.options.shortcutMetaKey === 'alt' && e.altKey
//              || research.options.shortcutMetaKey === 'none') {
//                  e.preventDefault();
//                  e.stopPropagation();
//                  research.toggle();
//                  return false;
//              }
//        }
//        // Handle Esc key to close
//        else if (e.keyCode == 27 && research.shouldClose(e.target))
//        {
//            e.target.blur();
//            research.close();
//        }

//        return true;
//    }, true);
//}

