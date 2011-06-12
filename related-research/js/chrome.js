/**
  * research.chrome
  *
  * Methods for sending / receiving messages from background.html
  **/

MODULE_NAME = "chrome";
console.log(MODULE_NAME+" loaded!");

research.chrome = {
    setIcon: function(value) {
        if (value)
            chrome.extension.sendRequest({ name: 'enablePageAction' }, function() {});
        else
            chrome.extension.sendRequest({ name: 'disablePageAction' }, function() {});
    },

    install: function(url, rules, id) {
        chrome.extension.sendRequest({ name: 'install', rules: rules, url: url, id: id }, function() {});
    },

    savePreference: function(name, value) {
        chrome.extension.sendRequest({ name: 'savePreference', preference: { name: name, value: value } }, function() {});
    },

    getPreference: function(name, callback) {
        chrome.extension.sendRequest({ name: 'getPreference', preferenceName: name }, function(response) {
            callback(response.value);
        });
    },

    openOptionsPage: function() {
        window.open(chrome.extension.getURL('options.html'));
    }
};

// Listen to requests from background.html
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {

        if (request.name === 'status') {
            if (window != window.top)
                return;
            sendResponse({ status: research.status });
        }

        else if (request.name === 'toggle')
        {
            if (window != window.top)
                return;

            research.toggle();
            sendResponse({ status: research.status });
        }

        else if (request.name === 'setOptions')
        {
            research.setOptions(request.options);
            sendResponse({});
        }

        else if (request.name === 'openWidget')
        {
            research.contextmenu.openWidget();
            sendResponse({});
        }

    }
);
