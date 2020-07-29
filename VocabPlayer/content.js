chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    alert(request.todo);
    if (request.todo == "displaySlider"){
        alert("Got display request. Displaying UX... ");
    }
    else if(request.todo == 'updateSlider'){
        alert("Got words request. Updating UX... ");
        //have word meanings list; split them and update
        //the UX;
    }
})

//Example to send message to EventPage
//chrome.runtime.sendMessage({todo: "downloadCaptions", captions: cue});

var str = document.URL;
if(str.search("youtube") != -1){
    //extract subtitles for youtube.
    videoelement = document.querySelector('video')
    videoelement.onpause = function () {
        var cues = "";
        var SubtitleWindow = document.getElementById('caption-window-1')
        if (SubtitleWindow) {
            var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
            for (i = 0; i < Subtitles.length; i++) {
                cues += Subtitles.item(i).textContent + " ";
            }
        }
        //alert("from content : youtube: "+ cues);
        var port = chrome.runtime.connect({name: "SubtitlesContainer"});
        port.postMessage({todo: "downloadCaptions", Subtitles : cues});
    }

}
else if(str.search("https://www.primevideo.com/") != -1 ){
    //write for prime video.
    //video container is delayed
    window.onload = function () {
        setInterval(showTime, 3000);
    }
    function showTime() {
        var videoelement = document.querySelector('video');
        if(videoelement){
            videoelement.onpause = function(){
                var cues = "";
                var cls = document.getElementsByClassName("fg8afi5");
                if(cls){
                    if(cls.item(0)){
                        cues = cls.item(0).textContent;
                    }
                }

                if(!cues.length){
                    var cls = document.getElementsByClassName("persistentPanel");
                    if(cls){
                        var spansc = cls.item(0);
                        if(spansc){
                            var spans = spansc.getElementsByTagName('span');
                            if(spans.item(1)){
                                cues = spans.item(1).textContent;
                            }
                        }
                    }
                }
                //alert("from content : AmazonPrime: "+ cues);
                var port = chrome.runtime.connect({name: "SubtitlesContainer"});
                port.postMessage({todo: "downloadCaptions", Subtitles : cues});
            }
        }
    }
}

else if(str.search("https://www.netflix.com/") != -1) {
    //write for netflix.
    //video container is delayed
    window.onload = function () {
        setInterval(showTime, 3000);
    }
    function showTime() {
        videoelement = document.querySelector('video')
        if (videoelement) {
            videoelement.onpause = function () {
                var cues = "";
                var SubtitleWindow = document.getElementsByClassName('player-timedtext-text-container')
                if (SubtitleWindow) {
                    var spansc = SubtitleWindow.item(0);
                        if(spansc){
                            var Subtitles = spansc.getElementsByTagName('span');
                            for (i = 0; i < Subtitles.length; i++) {
                                cues += Subtitles.item(i).textContent;
                            }
                        }
                }
                //alert("from content : NetFlix: " + cues);
                var port = chrome.runtime.connect({ name: "SubtitlesContainer" });
                port.postMessage({ todo: "downloadCaptions", Subtitles: cues });
            }
        } 
    }
}

document.body.appendChild(getHTMLOverLay());

function getHTMLOverLay(){
    var moverlay = document.createElement("DIV");
        moverlay.id = "moverlaydiv";
        $('#moverlaydiv').css('position','none');
        $('#moverlaydiv').css('top','0');
        $('#moverlaydiv').css('bottom','0');
        $('#moverlaydiv').css('left','400px');
        $('#moverlaydiv').css('right','0');
        $('#moverlaydiv').css('display','block');
        $('#moverlaydiv').css('background-color','rgba(0,0,0,0.5)');
        $('#moverlaydiv').css('color','#fff');
        $('#moverlaydiv').css('cursor','pointer');

    var meaningList = document.createElement("DIV");
        meaningList.id = "meaningListDiv";
        $('#meaningListDiv').css('overflow','auto');
        $('#meaningListDiv').css('height','450px');
        
    var vocablist = document.createElement("UL");
        vocablist.id = "vocablistUL";
        $('#vocablistUL').css('padding-right','10px');
        $('#vocablistUL').css('padding-inline-start','10px');

    moverlay.appendChild(meaningList);
    meaningList.appendChild(vocablist);
    vocablist.appendChild(getListItem("Word", "Meaning is the one that is written here"));
    return moverlay;
}

function getListItem(word, meaning){
    var vocablistItem = document.createElement("LI");
        vocablistItem.id = "vocablistLI";
        $('#vocablistLI').css('background-color','gray');
        $('#vocablistLI').css('display','block');
        $('#vocablistLI').css('margin-bottom','10px');

    var divWord = document.createElement("DIV");
        divWord.id = "word";
        $('#word').css('padding-top','5px');
        $('#word').css('padding-left','5px');
        $('#word').css('margin-bottom','10px');
        $('#word').text(word);

    var iBookmark = document.createElement("I");
        iBookmark.id = "bookmarkicon";
        $('#bookmarkicon').css('font-size','18px');
        $('#bookmarkicon').css('float','right');
        $('#bookmarkicon').css('padding-right','10px');

    var divMeaning = document.createElement("DIV");
        divMeaning.id = "meaning";
        $('#meaning').css('display','block');
        $('#meaning').css('padding-top','5px');
        $('#meaning').css('padding-bottom','5px');
        $('#meaning').css('padding-left','5px');
        $('#meaning').css('padding-right','5px');
        $('#meaning').text(meaning);
        vocablistItem.appendChild(divWord);
            divWord.appendChild(iBookmark);
        vocablistItem.appendChild(divMeaning);
        return vocablistItem;
}
