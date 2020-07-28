chrome.runtime.onConnect.addListener(function(port) {

    console.assert(port.name == "SubtitlesContainer");
    port.onMessage.addListener(function(msg) {
        if(msg.todo == "downloadCaptions"){
            //alert("EventPage : "+msg.Subtitles);
            downloadCaptions(msg.Subtitles);
        }
    });
  });

function constructUrl(word, language){
    //return 'https://www.google.com/search?q=%22'+word+'%20meaning%20in%20'+language+'%22';
}

function downloadCaptions(Subtitles){
    //split captions & send message to UI to display number of items to be displayed;
        //sendDisplaySliderMessage(10);
    //download captions from the url;
    alert("DownloadCaptions: " + Subtitles);
    list = Subtitles.toLowerCase().split(/[^A-Za-z]/);
    //sendDisplaySliderMessage(list.length);
    meanings = new Set();
    list.forEach(element=> {
        getDefinition(element, meanings);
    });
}

function getDefinition(word, set){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + word + "/define";
    //alert("Making request to: " + url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            console.log(ret);
            if(ret.error || ret.definitions.length == 0){
                console.log("error");
                set.add("error");
            } else{
                alert(ret.definitions[0]['definition']);
                set.add(ret.definitions[0]['definition']);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function sendWordAndMeaningToUX(wordMeaningsList){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "updateSlider", nitems: wordMeaningsList});
    });
}

function sendDisplaySliderMessage(lengthOfWords){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "displaySlider", nitems: lengthOfWords});
    });
}