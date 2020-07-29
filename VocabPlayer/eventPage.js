chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "SubtitlesContainer");
    port.onMessage.addListener(function(msg) {
        if(msg.todo == "downloadCaptions"){
            alert("EventPage : "+msg.Subtitles);
            downloadCaptions(msg.Subtitles);
        }
    });
  });

function downloadCaptions(Subtitles){
    alert("DownloadCaptions: " + Subtitles);
    list = Subtitles.toLowerCase().split(/[^A-Za-z]/);
    var filtered_set = new Set(list.filter(x => !consts_stopwords.has(x)));
    alert(1);
    sendDisplaySliderMessage(filtered_set.size);
    meanings = new Set();
    filtered_set.forEach(element=> {
        getDefinition(element, meanings);
    });
}

function getDefinition(word, set){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + word + "/define";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            console.log(ret);
            if(ret.error || ret.definitions.length == 0){
                set.add(word + " : error");
                sendWordAndMeaningToUX({word: word, meaning: 'error'})
            } else{
                //alert(ret.word + " : " + ret.definitions[0]['definition']);
                sendWordAndMeaningToUX({word: word, meaning: ret.definitions[0]['definition']})
                set.add(ret.definitions[0]['definition']);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function sendWordAndMeaningToUX(wordMeaningsList){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "updateSlider", meaning: wordMeaningsList});
    });
}

function sendDisplaySliderMessage(lengthOfWords){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {todo: "displaySlider", nitems: lengthOfWords});
    });
}