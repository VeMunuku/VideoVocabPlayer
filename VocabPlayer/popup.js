$('#mlang').on('change', function() {
	var selected = $( "#mlang" ).val();
	//document.getElementById("hello").innerHTML = selected;
	chrome.storage.sync.set({'language': selected});
});

$(window).on('load', function(){
	chrome.storage.sync.get('language', function(selected){
		var lang = selected.language;
		if(lang){
			//
		}
		else{
			lang = "English";
			chrome.storage.sync.set({'language': "English"});
		}
		$("#mlang option").each(function(){
		  if ($(this).text() == lang)
			$(this).attr("selected","selected");
		});
	});
});