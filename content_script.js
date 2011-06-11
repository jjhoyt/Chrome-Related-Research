// Object to hold information about the current page

var highlight = window.getSelection().toString();
var localSearch = localStorage.search;
if(highlight!="" && highlight!=localSearch) {
	var cacheHighlight = 1;
} else
{
	var cacheHighlight = 0;
}
var pageInfo = {
    "title": document.title,
    "url": window.location.href,
    "highlight": highlight,
    "cache": cacheHighlight
};

// Send the information back to the extension
chrome.extension.sendRequest(pageInfo);