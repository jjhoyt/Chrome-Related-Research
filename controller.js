
var mkey = 'ENTER YOUR API KEY HERE';

function prepQ() {
	
	var preppedQ = {
		"highlight": $("#searchQ").val(),
		"cache": 1
	}	
	displayLoader(true);
	onPageInfo(preppedQ);
}

function onPageInfo(o) {

	var mendeleyResponse;
	// Storing the seconds 
	var now = (new Date()).getTime()/1000;
	var search = o.title;
	// Use highlighted text to perform search instead of page title
	if(o.highlight!="") {
		search = o.highlight;
	}
	var QueryURL = 'http://api.mendeley.com/oapi/documents/search/' + encodeURIComponent(search) +
		'/?consumer_key='+mkey+'';
	
	// If there is no cache set in localStorage, or the cache is older than 1 hour:
	if(!localStorage.cache || now - parseInt(localStorage.time) > 1*60*60 || o.cache!=0)
	{
		$.get(QueryURL,function(msg){
			
			// Setting the cache
			mendeleyResponse = JSON.stringify(msg);
			//localStorage[\''+url+'\'".cache"]	= mendeleyResponse;
			localStorage.cache	= mendeleyResponse;
			localStorage.search	= search;
			localStorage.time	= now;
			displayResponse();
		},'json');
	}
	else {
		// The cache is fresh, use it:
		displayResponse();
	}
}

function displayResponse() {
	
	$(document).ready(function(){

		mendeleyResponse = JSON.parse(localStorage.cache);
		search = localStorage.search;
		var items = mendeleyResponse.documents;
		var htmlString = "";
		htmlString +='<div style="width:360px"><a href="http://www.mendeley.com/research-papers/" target="_blank"><img src="MlogoFSM.png" height="25px" style="margin-left:-8px"/></a>\
			<a id="headerLink" href="#">Share</a> <a id="headerLink" href="#">Save</a></div><div style="clear:both"></div>\
			<div id="header"><form><input id="searchQ" type="text" value="'+search+'" size="45" /> <input id="staticButton" type="submit" value="Search" onclick="prepQ(); return false;"/></form></div>';
		
		htmlString +='<div id="clearThisOnNew">';
			for(var i=0;i<items.length;i++)
			{
				var divId = "detailDisplay"+i;
				
				var tut = items[i];
				
				htmlString += '<div id="results">\
								<div id="title"><a href="'+tut.mendeley_url+'" target="_blank">'+tut.title+'</a></div>\
								<span id="authors">'+tut.authors+' ('+tut.year+')</span> - <span id="metaLink"><a href="#" onclick="moreLikeThis(\''+tut.uuid+'\',\''+tut.title+'\',\''+tut.mendeley_url+'\'); return false;">More like this</a></span> - <span id="metaLink"><a href="#" onclick="showDeets('+i+',\''+tut.uuid+'\'); return false;">Details</a></span><br/>\
								<div id="'+divId+'" style="display:none"></div>\
								<br/>\
								</div>';
			}
		htmlString +='</div>';
		// Updating the content div:
		$('#content').html(htmlString);

		// Remove loading icons
		displayLoader(0);
		
	});

} 

function togAuth() {
	$("#tog").click(function () {
			$("#tog").toggle();
		});
}

function showDeets(i,uuid) {

	var QueryURL = 'http://api.mendeley.com/oapi/documents/details/' + encodeURIComponent(uuid) +
		'/?consumer_key='+mkey+'';
	
	// If there is no cache set in localStorage, or the cache is older than 1 hour:
	$.get(QueryURL,function(msg){

		var htmlDetails = "";
		htmlDetails +='<div id="contentDeets"><b>Readers: </b>'+msg.stats.readers+'</br>';
		
		if(msg.abstract) {
				htmlDetails +='<div id="abstractDeet">'+msg.abstract+'</div>\
				</div>';
		} 
		else {
		 	htmlDetails +='</div>';
		}
			// Return the response
			$("#detailDisplay"+i, document).show('fast').html(htmlDetails);
	},'json');
	
}

function moreLikeThis(mUuid,mTitle,mUrl) {
		
		displayLoader(true);
		//displayLoader(true);
		var QueryURL = 'http://api.mendeley.com/oapi/documents/related/' + encodeURIComponent(mUuid) +
		'/?consumer_key='+mkey+'';
	
		$.get(QueryURL,function(msg){

			var items = msg.documents;
			var htmlString = "";
			htmlString +='<FORM><INPUT TYPE="button" id="staticButton" VALUE="Back" onClick="displayResponse();return true;"></FORM></br><div id="header">Similar to <a href="'+mUrl+'" target="_blank">'+mTitle+'</a></div>';
			htmlString +='<div id="clearThisOnNew">';
				for(var i=0;i<items.length;i++)
				{
					var divId = "detailDisplay"+i;
					
					var tut = items[i];
					
					htmlString += '<div id="results">\
									<div id="title"><a href="'+tut.mendeley_url+'" target="_blank">'+tut.title+'</a></div>\
									<span id="authors">'+tut.authors+' ('+tut.year+')</span> - <span id="metaLink"><a href="#" onclick="moreLikeThis(\''+tut.uuid+'\',\''+tut.title+'\',\''+tut.mendeley_url+'\'); return false;">More like this</a></span> - <span id="metaLink"><a href="#" onclick="showDeets('+i+',\''+tut.uuid+'\'); return false;">Details</a></span><br/>\
									<div id="'+divId+'" style="display:none"></div>\
									<br/>\
									</div>';
				}
			htmlString +='</div>';
			// Updating the content div:
			$('#content').html(htmlString);
			
			// Remove loading icons
			displayLoader(0);
		
		},'json');

} 

function displayLoader(bool) {
		
		//Check to ensure div loader exists otherwise inject into div loading
		if(document.getElementById('loader')) {
			var loader = document.getElementById('loader');
			var clearDiv = 'content';
		} else
		{
			var loader = document.getElementById('loading');
			var clearDiv = 'clearThisOnNew';
		}
		var loadLogo = document.getElementById('loading');
		if (bool) {
			document.getElementById(clearDiv).style.display = 'none';
			loader.innerHTML = '<center><img src="ajax-loader.gif" alt="loading..." /></center>';
		}
		else {
			document.getElementById('content').style.display = 'block';
			loader.innerHTML = '';
			loadLogo.innerHTML = '';
		}
	
	}