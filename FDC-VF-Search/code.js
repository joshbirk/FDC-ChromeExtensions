var xmlhttp = new XMLHttpRequest();
var results = null;
var stems = null;
var usedIndexes = '';

function decodeResults() {
	console.log(results.length);
	
	console.log(stems.length);
	var head = document.createElement('div');
	head.innerHTML = '<h1>Title Results</h1>';
	document.getElementById('SearchResults').appendChild(head);
	
	for(var i = 0; i < results.length; i++) {
		if(results[i].getAttribute('Title') != null && results[i].getAttribute('Title').toLowerCase().indexOf(searchText.toLowerCase()) >= 0 && usedIndexes.indexOf('|'+i+'|' < 0)) {
		usedIndexes += "|"+i+"|";
		d = document.createElement('div');
		d.innerHTML = results[i].getAttribute('Title');
		d.id = i;
		d.className = 'SearchResultsRow';
//		d.onmousedown = function(e) { window.location.href = results[e.target.id].getAttribute('Source') };
		d.onmousedown = function(e) { document.getElementById('content').src = results[e.target.id].getAttribute('Source') };
		document.getElementById('SearchResults').appendChild(d); 
		}
	}
	var head2 = document.createElement('div');
	head2.innerHTML = '<h1>Content Results</h1>';
	document.getElementById('SearchResults').appendChild(head2);
	
	
	//check stems
	for(var x = 0; x < stems.length; x++) {
		if(stems[x].getAttribute('n').toLowerCase() == searchText.toLowerCase()) {
			addStemResults(x);
		}
	}	
	
	document.getElementById('LoadingDiv').innerHTML = '';
	document.title = 'VF Docs: '+searchText;
	
}

function addStemResults(index) {
	var stemhttp = new XMLHttpRequest();
	stemhttp.open("GET", "http://www.salesforce.com/us/developer/docs/pages/Data/"+stems[index].getAttribute('chunk'),true);
	stemhttp.overrideMimeType('text/xml');
	stemhttp.onreadystatechange=function() {
  	if (stemhttp.readyState==4) {
    	getChunkResults(stemhttp.responseXML.getElementsByTagName('phr'));
  		}
	}
	stemhttp.send(null);
	console.log('sent stem request');

}

function getChunkResults(chunks) {
	console.log(chunks.length);
	
	for(var i = 0; i < chunks.length; i++) {
		if(chunks[i].getAttribute('n').toLowerCase() == searchText.toLowerCase()) {
		for(var x = 0; x < chunks[i].childNodes.length; x++) {	
			var index = chunks[i].childNodes[x].getAttribute('t');
			if(usedIndexes.indexOf('|'+index+'|') < 0) {
			usedIndexes += "|"+index+"|";
			d = document.createElement('div');
			d.innerHTML = results[index].getAttribute('Title');
			d.id = index;
			d.className = 'SearchResultsRow';
//			d.onmousedown = function(e) { window.location.href = results[e.target.id].getAttribute('Source') };	
			d.onmousedown = function(e) { document.getElementById('content').src = results[e.target.id].getAttribute('Source') };	
	
			document.getElementById('SearchResults').appendChild(d);
			}
			
			}
			
		}
	}

}



if(document.getElementById('SearchResults')) { 

	if(!document.getElementById('LoadingDiv')) {   //already done
	
	document.title = 'Searching VF Docs: '+searchText;
	
	var l = document.createElement('div');
	l.innerHTML = 'Loading...';
	l.id = 'LoadingDiv';

	document.getElementById('SearchResults').appendChild(l);
	document.getElementById('SearchResults').style.height = window.innerHeight - 10 + 'px';
	
	var iframe = document.createElement('iframe');
	iframe.className = 'contentFrame';
	iframe.id = 'content';
	document.getElementsByTagName('body')[0].appendChild(iframe);
	

	xmlhttp.open("GET", "http://www.salesforce.com/us/developer/docs/pages/Data/Search.xml",true);
	xmlhttp.overrideMimeType('text/xml');
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4) {
	    results = xmlhttp.responseXML.getElementsByTagName('Url');
	    stems = xmlhttp.responseXML.getElementsByTagName('stem');
	  	decodeResults();
	  }
	}
	xmlhttp.send(null);
	
	}
}





