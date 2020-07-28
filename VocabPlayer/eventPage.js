chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "downloadCaptions"){
        //alert("EventPage : "+request.captions);
        downloadCaptions(request.captions);
    }
});

function constructUrl(word, language){
    //return 'https://www.google.com/search?q=%22'+word+'%20meaning%20in%20'+language+'%22';
}

function downloadCaptions(captions){
    //split captions & send message to UI to display number of items to be displayed;
        //sendDisplaySliderMessage(10);
    //download captions from the url;

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