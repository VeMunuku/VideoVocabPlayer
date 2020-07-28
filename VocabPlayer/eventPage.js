chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == "downloadCaptions"){
        downloadCaptions(request.captions);
    }
});

function downloadCaptions(captions){
    //split captions & send message to UI to display number of items to be displayed;
        //sendDisplaySliderMessage(10);
    //download meanings from the url;
    alert("Download captions: " + captions);
    list = captions.toLowerCase().split(/[^A-Za-z]/);
    //var filtered = unique_list.filter(function(value, index, arr){ return value != "";});
    alert("Sending length: " + list.length);
    sendDisplaySliderMessage(list.length);
    meanings = new Set();
    list.forEach(element => {
        getDefinition(element, meanings);
    }); 
    console.log("Sending words meanings: " + meanings);
    //sendWordAndMeaningToUX(meanings);
}

function getDefinition(word, set){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + word + "/define";
    alert("Making request to: " + url);
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

// function sortOrder(list){
//     var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
//     var url = endpoint + "sort"
//     console.log("Making request to: " + url);
//     console.log("data = " + list);
//     var xhttp = new XMLHttpRequest();
//     xhttp.open("POST", url, false);
//     xhttp.setRequestHeader("Content-Type", "application/json");
//     xhttp.send(JSON.stringify(list));
//     return JSON.parse(xhttp.responseText);
// }

function getTranslation(word, to, set){
    var endpoint = "http://hackathonbox.westus2.cloudapp.azure.com:8000/h4ck4th0n/";
    var url = endpoint + word + "/" + "translate/" + to;
    console.log("Making request to: " + url);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            set.add(ret.result);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function sendSingleWordAndMeaningToUX(wordMeaningsList){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {todo: "updateSliderSingle", nitems: wordMeaningsList});
    });
}

function sendDisplaySliderMessage(lengthOfWords){
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, {todo: "displaySlider", nitems: lengthOfWords});
    });
}