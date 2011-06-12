/* Background JS for research */

var currTabId;
var contextMenuId = null;

var cache = {
    // Styles object
    styles: {},

    options: {
        useShortcutKey: true,
        shortcutKey: 77, // keydown code for 'm'
        shortcutMetaKey: 'alt',
        mode: 'Basic',
        contextMenu: true
    },

};


// Initialize
//
function init() {
    loadOptionsIntoCache();
    createContextMenu();
    attachListeners();
}


// Listen to requests from tabs and page action
//
function attachListeners() {

    if (cache.options.showPageAction == typeof undefined ||
        cache.options.showPageAction) {
        showPageActions();
    }

    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            switch (request.name) {
                case 'enablePageAction' :
                    if (cache.options.showPageAction) {
                        enablePageAction(sender.tab);
                    }
                    sendResponse({});
                    break;

                case 'disablePageAction' :
                    if (cache.options.showPageAction) {
                        disablePageAction(sender.tab);
                    }
                    sendResponse({});
                    break;

                case 'save' :
                    cache.styles.save(request.url, request.rules, request.data);
                    sendResponse({});
                    break;

            }
    });
}


// Toggle actions when page icon is clicked
//
function onPageActionClick(tab) {
    chrome.tabs.sendRequest(tab.id, { name: 'toggle' }, function(response) {
        if (response.status)
            enablePageAction(tab);
        else
            disablePageAction(tab);
    });
}

function refreshPageAction(tab) {
    chrome.tabs.sendRequest(tab.id, { name: 'status' }, function(response) {
        if (response.status)
            enablePageAction(tab);
        else
            disablePageAction(tab);
    });
}

// Update page action to indicate that the widget is not visible
//
function disablePageAction(tab) {
    // if a style is applied to the current page
    //
    if (cache.styles.exists(tab.url)) {
        chrome.pageAction.setIcon({ tabId: tab.id, path: 'images/css_highlighted.png' });
    }
    else {
        chrome.pageAction.setIcon({ tabId: tab.id, path: 'images/css.png' });
    }

    chrome.pageAction.setTitle({ tabId: tab.id, title: 'Mendeley Related Research' });
}

// Update page action to indicate that widget is visible
//
function enablePageAction(tab) {
    chrome.pageAction.setIcon({ tabId: tab.id, path: 'images/css_active.png' });
    chrome.pageAction.setTitle({ tabId: tab.id, title: 'Click to close' });
}

// Load options from localStorage into background cache
function loadOptionsIntoCache() {
    for (var option in cache.options)
    {
        var dataStoreValue = localStorage['research_option_' + option];
        if (dataStoreValue) {
            if (dataStoreValue == 'true' || dataStoreValue == 'false')
                cache.options[option] = (dataStoreValue == 'true');
            else
                cache.options[option] = dataStoreValue;
        }
        else
            localStorage['research_option_' + option] = cache.options[option];
    }
}

// Save an option
function saveOption(name, value) {
    cache.options[name] = value;
    localStorage['research_option_' + name] = value;
    propagateOptions();

    // option specific code
    if (name === 'contextMenu' && value === false)
        removeContextMenu();
    else if (!contextMenuId)
        createContextMenu();
}

function savePreference(preference) {
    localStorage[preference.name] = preference.value;
}

function getPreference(preferenceName) {
    return { name: preferenceName, value: localStorage[preferenceName] };
}

// Initialize the context Menu
function createContextMenu() {
    chrome.contextMenus.create({
          title: "Search with Mendeley",
          contexts: ["selection"],
          onclick: function(info, tab) { 
            sendRequestToTab(tab, 'openWidget'); 
          }
    });
}

// Remove the right click context menu
function removeContextMenu() {
    if (contextMenuId) {
        chrome.tabs.onSelectionChanged.removeListener(updateContextMenuOnSelectionChanged);
        chrome.tabs.onUpdated.removeListener(updateContextMenuOnUpdated);
        chrome.contextMenus.remove(contextMenuId);
        contextMenuId = null;
    }
}

// Send a request to tab
function sendRequestToTab(tab, msg) {
    chrome.tabs.sendRequest(tab.id, { name: msg }, function() {});
}

window.addEventListener('load', function() {
    init();
});

