
///* Background JS for research */

//var currTabId;
//var contextMenuId = null;

//var cache = {
//    // Searches object (URLs)
//    searches: {},

//    options: {
//        useShortcutKey: true,
//        shortcutKey: 77, // keydown code for 'm'
//        shortcutMetaKey: 'alt',
//        mode: 'Basic',
//        contextMenu: true
//    },

//};


//// Initialize
////
//function init() {
//    createContextMenu();
////    attachListeners();
//}


//// Listen to requests from tabs and page action

//function attachListeners() {
////console.log("Listeners attached!");
//    chrome.extension.onRequest.addListener(
//        function(request, sender, sendResponse) {
//            console.log("Request caught!");
//            switch (request.name) {
//                case 'enablePageAction' :
//                    enablePageAction(sender.tab);
//                    sendResponse({});
//                    break;

//                case 'disablePageAction' :
//                    disablePageAction(sender.tab);
//                    sendResponse({});
//                    break;
//            }
//    });
//}


//// Toggle actions when page icon is clicked
////
//function onPageActionClick(tab) {
//    chrome.extension.sendRequest({ name: 'toggle' }, function(response) {
//        if (response.status)
//            enablePageAction(tab);
//        else
//            disablePageAction(tab);
//    });
//}

//function refreshPageAction(tab) {
//    chrome.extension.sendRequest({ name: 'status' }, function(response) {
//        if (response.status)
//            enablePageAction(tab);
//        else
//            disablePageAction(tab);
//    });
//}

////// Update page action to indicate that the widget is not visible
////
//function disablePageAction(tab) {
//    //
//    if (cache.searches.exists(tab.url)) {
//        chrome.pageAction.setIcon({ tabId: path: 'images/css_highlighted.png' });
//    }
//    else {
//        chrome.pageAction.setIcon({ tabId: path: 'images/css.png' });
//    }

//    chrome.pageAction.setTitle({ tabId: title: 'Mendeley Related Research' });
//}

// Update page action to indicate that widget is visible

//function enablePageAction(tab) {
//    chrome.pageAction.setIcon({ tabId: path: 'images/css_active.png' });
//    chrome.pageAction.setTitle({ tabId: title: 'Click to close' });
//}

//// Initialize the context Menu
//function createContextMenu() {
//    chrome.contextMenus.create({
//          title: "Search with Mendeley",
//          contexts: ["selection"],
//          onclick: function(info, tab) { 
//            sendRequest('openWidget'); 
//          }
//    });
//}

//// Remove the right click context menu
////function removeContextMenu() {
////    if (contextMenuId) {
////        chrome.tabs.onSelectionChanged.removeListener(updateContextMenuOnSelectionChanged);
////        chrome.tabs.onUpdated.removeListener(updateContextMenuOnUpdated);
////        chrome.contextMenus.remove(contextMenuId);
////        contextMenuId = null;
////    }
////}

//// Send a request
//function sendRequest(msg) {
//    var result = chrome.tabs.sendRequest({ name: msg }, function() {});
//}

//window.addEventListener('load', function() {
//    init();
//});

