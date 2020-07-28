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