chrome.storage.sync.get('language', function(selected){
    if(selected.language == "Telugu"){
        language_code = "te";
    }
    else if(selected.language == "Hindi"){
        language_code = "hi";
    }
    alert(language_code);
});

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "SubtitlesContainer");
    port.onMessage.addListener(function(msg) {
        if(msg.todo == "downloadCaptions"){
            //alert("EventPage : "+msg.Subtitles);
            downloadCaptions(msg.Subtitles);
        }
    });
  });

function downloadCaptions(Subtitles){
        //alert("DownloadCaptions: " + Subtitles);
    list = Subtitles.toLowerCase().split(/[^A-Za-z]/);
    var filtered_set = new Set(list.filter(x => !consts_stopwords.has(x)));
    if(filtered_set.size == 0)
        return;
    sendDisplaySliderMessage(filtered_set.size);
    //alert(JSON.stringify({list: [...filtered_set]}));
    var resp = JSON.parse(sortOrder({list: [...filtered_set]}));
    filtered_set.forEach(element=> {
        getDefinition(element, resp.answer);
    });
}

function getDefinition(word, order){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + word + "/define/" + language_code;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            console.log(ret);
            if(ret.error || ret.define.definitions.length == 0){
                sendWordAndMeaningToUX({index: order.findIndex(x => x == word), word: word, meaning: 'error'})
            } else{
                sendWordAndMeaningToUX({index: order.findIndex(x => x == word), word: word, meaning: ret.define.definitions[0]['definition'], trans: ret.trans})
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function sortOrder(list){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + "sort"
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(list));
    return xhttp.responseText;
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