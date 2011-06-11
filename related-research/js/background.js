// Initialize

function init() {
    createContextMenu();
}

// Context Menu
function createContextMenu() {
    chrome.contextMenus.create({
          title: "Search with Mendeley",
          contexts: ["selection"],
          onclick: function(info, tab) {
            console.log(info.selectionText);
            displayLoader(true);
          }
    });
}

window.addEventListener('load', function(){
    init();
});
