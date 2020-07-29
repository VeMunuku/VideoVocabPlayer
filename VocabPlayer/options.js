function generateTable(table, data) {
  for (var i = 0; i < data.length; i++) {
	
	//Can improvise the CSS later if need be
	var badge = document.createElement('tr');
	badge.innerHTML = 
		'<th> <b>' + data[i].Word + '</th> </b>' +
		'<th> <b>' + data[i].Meaning + '</th> </b>' +
		'<th> <b>' + data[i].Translated + '</th> </b>' +
		'<th> <b>' + data[i].Video_Title + '</th> </b>' +
		'<th> <b>' + data[i].Caption + '</th> </b>' +
		'<th> <b>' + data[i].Date + '</th> </b>' +
		'</tr>';
	var body = document.getElementById('list');
	console.log(body);
	body.appendChild(badge);
	}
}
/*
var data = [
  {
	"Word": "Prodigy",
	"Meaning": "A persoon of a different level in a stream",
	"Language": "English",
	"Video_Title": "Could be anything",
	"Caption": "Some subtitle text containing prodigy",
	"Date": "2020-07-27 13:43:00"
  },
  {
	"Word": "deft",
	"Meaning": "perfectly executed",
	"Language": "English",
	"Video_Title": "Could en anything",
	"Caption": "Some subtitle text containing deft",
	"Date": "2020-07-27 14:45:00"
  }
]; 
*/
chrome.storage.sync.get('language', function(selected){
	var lang = document.getElementById('language');
	lang.innerHTML = selected.language;
});
chrome.storage.sync.get('bookmarkedWords', function(bookmarked){
	var data = [];
	if(bookmarked.bookmarkedWords){
		data = bookmarked.bookmarkedWords;
	}
	var table = document.querySelector("table");
	console.log(table);
	generateTable(table, data);
});

