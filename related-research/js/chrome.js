///**
//  * research.chrome
//  *
//  * Methods for sending / receiving messages from background.html
//  **/

//MODULE_NAME = "chrome";
//console.log(MODULE_NAME+" loaded!");

//research.chrome = {
//    setIcon: function(value) {
//        if (value)
//            chrome.extension.sendRequest({ name: 'enablePageAction' }, function() {});
//        else
//            chrome.extension.sendRequest({ name: 'disablePageAction' }, function() {});
//    }
//};

//// Listen to requests from background.html
//chrome.extension.onRequest.addListener(
//    function(request, sender, sendResponse) {

//        if (request.name === 'status') {
//            if (window != window.top)
//                return;
//            sendResponse({ status: research.status });
//        }

//        else if (request.name === 'toggle')
//        {
//            if (window != window.top)
//                return;

//            research.toggle();
//            sendResponse({ status: research.status });
//        }

//        else if (request.name === 'openWidget')
//        {
//            research.contextmenu.openWidget();
//            console.log("openWidget called!");
//            sendResponse({});
//        }

//    }
//);
