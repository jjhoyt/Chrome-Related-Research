
var mkey = '03bf6d86faa6f4769942c1b8dfdf90d704df4ff38';

function prepQ() {
	
	var preppedQ = {
		"highlight": $("#searchQ").val(),
		"cache": 1
	}	
	displayLoader(true);
	onPageInfo(preppedQ);
}

function parseSearchEngine(url) {
	//PubMed query check
	var newSearch = pubmedQuery(url);

	return newSearch;
	//Google Scholar query check
	//scholarQuery(url);
	
	//arXiv query check
	//arxivQuery(url);
	
	//citeseer query check
	//citeseerQuery(url);

}

function pubmedQuery(url) {
	
      var re1='(http:\\/\\/www\\.ncbi\\.nlm\\.nih\\.gov\\/pubmed\\?term=)';	// HTTP URL 1
	  var re2='(.*)';	// Query terms
      var p = new RegExp(re1+re2,["i"]);
      var m = p.exec(url);
      if (m != null)
      {
          var newSearch=m[2];
          return newSearch;
      }
      return(false);
}

function findUUID(id, type) {
	//Gets the Mendeley UUID, which is needed to find related research with the related research method. We also grab some details like readership and the mendeley url if the PubMed article is on Mendeley
	var Query2URL = 'http://api.mendeley.com/oapi/documents/details/' + encodeURIComponent(id) +
		'/?consumer_key='+mkey+'&type='+type+'';

    var rawDetails = $.ajax({
      url: Query2URL,
      dataType: "json",
      async: false,
      success: function(msg){
		var details = {
			"uuid": msg.uuid,
			"readers": msg.stats.readers,
			"mURL": msg.mendeley_url,
			"title": msg.title
		};
		return details;
      }
    }).responseText;	    
 	rawDetails = JSON.parse(rawDetails);
 	 
    if(rawDetails.error){
        return;
    }
    else {
        var newDetails = {};
        newDetails.uuid = rawDetails.uuid;
        newDetails.readers = rawDetails.stats.readers;
        newDetails.mURL = rawDetails.mendeley_url;
        newDetails.title = rawDetails.title;
        
        return newDetails;
    }

}

function findBasedOnUUID(UUID, pageURL){

	var QueryURL = 'http://api.mendeley.com/oapi/documents/related/' + UUID +
		'/?consumer_key='+mkey+'';

		$.get(QueryURL,function(msg){
			// Setting the cache			
			var mendeleyResponse = JSON.stringify(msg);
			localStorage[pageURL+".response.cache"]	= mendeleyResponse;
			displayResponse(pageURL);
		},'json');
}

function pmidCheck(pageURL) {
	//Function just looks at the URL for an obvious PMID. Could expand this function to parse entire html in case PMID is not in URL
	var re1='(http:\\/\\/www\\.ncbi\\.nlm\\.nih\\.gov\\/pubmed)';	// HTTP URL 1

      var p = new RegExp(re1,["i"]);
      var m = p.exec(pageURL);
      if (m != null)
      {
          var httpurl1=m[1];
      }
      if (httpurl1 !=null)
      {
      	var re1='.*?';	// Non-greedy match on filler
		var re2='(\\d+)';	// Integer Number 1

		var p = new RegExp(re1+re2,["i"]);
		var m = p.exec(pageURL);
		if (m != null)
		{
			var id = m[1];
			//Have PMID, now fetch the Mendeley UUID
			var details = findUUID(id, 'pmid');

            if(details!= null){    
                return details;
            }
		}
      }
      return (false);
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
	//Let's first check if we are on a search engine and can pull out the query terms from the URL
	newSearch = parseSearchEngine(o.url);

	if (newSearch != false) {
		newSearch = unescape(newSearch);
		var QueryURL = 'http://api.mendeley.com/oapi/documents/search/' + encodeURIComponent(newSearch) +
		'/?consumer_key='+mkey+'';
		search = newSearch;
	}
	else {
		var QueryURL = 'http://api.mendeley.com/oapi/documents/search/' + encodeURIComponent(search) +
		'/?consumer_key='+mkey+'';
	}
	
    var url = o.url;
    var CACHE_TIMEOUT = 1*1*1;
    var CACHE_STATE = localStorage[url+".response.cache"]
	// If there is no cache set in localStorage, or the cache is older than 1 hour:
	if(!CACHE_STATE || now - parseInt(localStorage.time) > CACHE_TIMEOUT || o.cache!=0)
	{
		//Does the page contain a valid PubMed ID? Use this to find related research instead of normal search query
		var relatedUUID = pmidCheck(o.url);

		if (relatedUUID!=false && newSearch==false) {
			//this looks up related research based on uuuid and returns it to the displayresponse function
			localStorage[url+".search.cache"]	= relatedUUID.title;
			localStorage.time	= now;
			findBasedOnUUID(relatedUUID.uuid, o.url);			
		} else {
			//No UUID - so look up based on page title
			$.get(QueryURL,function(msg){		
				// Setting the cache
				mendeleyResponse = JSON.stringify(msg);
				localStorage[url+".response.cache"]	= mendeleyResponse;
				localStorage[url+".search.cache"]	= search;
				localStorage.time	= now;
				displayResponse(url);
			},'json');
		}
	}
	else {
		// The cache is fresh, use it:
		displayResponse(url);
	}
}

function displayResponse(url) {
	
	$(document).ready(function(){
             
		mendeleyResponse = JSON.parse(localStorage[url+".response.cache"]);

		search = JSON.parse(JSON.stringify({ search: localStorage[url+".search.cache"]})).search;

		var len = 25;
		var truncatedText = search.substring(0,len);
		var items = mendeleyResponse.documents;
		var htmlString = "";
		htmlString +='<div style="width:360px"><a href="http://www.mendeley.com/research-papers/" target="_blank"><img src="../images/MlogoFSM.png" height="25px" style="margin-left:-8px"/></a>\
            <div style="float:right"><iframe src="https://www.facebook.com/plugins/like.php?href='+encodeURIComponent(url)+'&amp;layout=button_count&amp;width=205&amp;show_faces=false&amp;action=recommend&amp;height=21" scrolling="no" frameborder="0" style="border:none; width:125px; height:21px"></iframe></div>\
			<div style="float:right"><a id="headerLink" href="http://twitter.com/share/?text=Found research on Mendeley about %22'+truncatedText+'...%22 using Mendeley Related for Chrome" class="twitter-share-button" data-url="'+url+'">Tweet</a></div><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div style="clear:both"></div>\
			<div id="header"><form><input id="searchQ" type="text" value="'+search+'" size="45" /> <input id="staticButton" type="submit" value="Search" onclick="prepQ(); return false;"/></form></div>';
	
		htmlString +='<div id="clearThisOnNew">';
			for(var i=0;i<items.length;i++)
			{
				var divId = "detailDisplay"+i;
				
				var tut = items[i];
				
				htmlString += '<div id="results">\
								<div id="title"><a href="'+tut.mendeley_url+'" target="_blank">'+tut.title+'</a></div>\
								<span id="authors">'+tut.authors+' ('+tut.year+')</span> - <span id="metaLink"><a href="#" onclick="moreLikeThis(\''+tut.uuid+'\',\''+tut.title+'\',\''+tut.mendeley_url+'\',\''+url+'\'); return false;">More like this</a></span> - <span id="metaLink"><a href="#" onclick="showDeets('+i+',\''+tut.uuid+'\'); return false;">Details</a></span><br/>\
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

function moreLikeThis(mUuid,mTitle,mUrl,tabURL) {
		
		displayLoader(true);
		//displayLoader(true);
		var QueryURL = 'http://api.mendeley.com/oapi/documents/related/' + encodeURIComponent(mUuid) +
		'/?consumer_key='+mkey+'';
	
		$.get(QueryURL,function(msg){

			var items = msg.documents;
			var htmlString = "";
			htmlString +='<FORM><INPUT TYPE="button" id="staticButton" VALUE="Back" onClick="displayResponse(\''+tabURL+'\');return true;"></FORM></br><div id="header">Similar to <a href="'+mUrl+'" target="_blank">'+mTitle+'</a></div>';
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
			loader.innerHTML = '<center><img src="../images/ajax-loader.gif" alt="loading..." /></center>';
		}
		else {
			document.getElementById('content').style.display = 'block';
			loader.innerHTML = '';
			loadLogo.innerHTML = '';
		}
	
	}
