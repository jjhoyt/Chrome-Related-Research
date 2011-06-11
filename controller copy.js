function onPageInfo(o) {

  $(document).ready(function(){
	
	var mendeleyResponse;
	// Storing the seconds since the epoch in now:
	var now = (new Date()).getTime()/1000;
	//var urlTitle = encodeURI(jQuery(this).attr('title'));
	//chrome.tabs.getSelected(null,function(tab) { encodeTabTitle(tab.title); });

	var QueryURL = 'http://www.mendeley.com/oapi/documents/search/' + encodeURIComponent(o.title) +
		'/?consumer_key=???';
	
	// If there is no cache set in localStorage, or the cache is older than 1 hour:
	if(!localStorage.cache || now - parseInt(localStorage.time) > 1*60*60)
	{
		$.get(QueryURL,function(msg){
			
			// Setting the cache
			mendeleyResponse = JSON.stringify(msg);
			localStorage.cache	= mendeleyResponse;
			localStorage.time	= now;
			displayLoader(0);
		},'json');
		mendeleyResponse = JSON.parse(localStorage.cache);
	}
	else {
		// The cache is fresh, use it:
		mendeleyResponse = JSON.parse(localStorage.cache);
		displayLoader(0);
	}
		
	var items = mendeleyResponse.documents;
	var htmlString = "";
	htmlString +='<div id="header"><img src="mendeleyHorizontal.png" height="25px" style="margin-left:200px"/></div>';
	
	for(var i=0;i<items.length;i++)
	{
		var divId = "detailDisplay"+i;
		
		var tut = items[i];
		htmlString += '<div id="results">\
						<div id="title"><a href="'+tut.mendeley_url+'" target="_blank">'+tut.title+'</a></div>\
						<span id="authors">'+tut.authors+' ('+tut.year+')</span> - <span id="metaLink"><a href="#">More like this</a></span> - <span id="metaLink"><a href="#" class="details" value="'+divId+'" onclick="showDeets(); return false;">Details</a></span><br/>\
						<div id="'+divId+'" style="display:none">hello there cutie</div>\
						<br/>\
						</div>';
	}



	// Updating the content div:
	$('#content').html(htmlString);
	
	// Show details if clicked
	//$("a").click(function () {	
		//spanDeets = this.value;
	//	spanDeets = "detailDisplay1";
		//$('#'+spanDeets).show('slow');
		//return false;
	//});
});

} 

function showDeets() {
	spanDeets = this.value;
		$('#'+spanDeets).show('slow');
}

function displayLoader(bool) {
	
		var loader = document.getElementById('loader');
		var loadLogo = document.getElementById('loading');
		if (bool) {
			document.getElementById('content').style.display = 'none';
			loader.innerHTML = '<img src="ajax-loader.gif" alt="loading..." />';
		}
		else {
			document.getElementById('content').style.display = 'block';
			loader.innerHTML = '';
			loadLogo.innerHTML = '';
		}
	
	}