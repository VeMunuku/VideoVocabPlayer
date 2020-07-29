chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "displaySlider"){
        alert("Got display request. Displaying UX... " + request.nitems + " items to display");
        var inject_html_start = '<div id="video_overlays" style="font-size:20;position:absolute;float:right;width:320px;min-height:370px;background-color:#000;z-index:300000;">'
        var inject_html_end = '</div>';
        var one_empty_box = '<li><div><p id="PID_WORD">Word</p><p id="PID_MEANING">Meaning</p><p id="PID_TRANS">Translation</p></div></li>';
        var n_boxes = ''
        for (i = 0; i < request.nitems; i++) {
            var my_empty_box = (' ' + one_empty_box).slice(1);
            my_empty_box = my_empty_box.replace("PID_WORD", "PID_WORD_" + i);
            my_empty_box = my_empty_box.replace("PID_MEANING", "PID_MEANING_" + i);
            my_empty_box = my_empty_box.replace("PID_TRANS", "PID_TRANS_" + i);
            n_boxes += my_empty_box;
        }
        var video = document.querySelector("video");
        var next = inject_html_start + n_boxes + inject_html_end;
        video.insertAdjacentHTML('afterend', next);
    }
    else if(request.todo == 'updateSlider'){
        alert("Got words request. Updating UX... " + JSON.stringify(request.meaning));
        var thisindex = request.meaning.index;
        var wordID = "PID_WORD_" + thisindex;
        var meaningID = "PID_MEANING_" + thisindex;
        var transID = "PID_TRANS_" + thisindex;
        alert(wordID + meaningID + transID);
        var wordp = document.getElementById(wordID);
        var meaningp = document.getElementById(meaningID);
        var transp = document.getElementById(transID);
        wordp.innerHTML = request.meaning.word;
        meaningp.innerHTML = request.meaning.meaning;
        transp.innerHTML = ""; // none for now.

    }
})

//Example to send message to EventPage
//chrome.runtime.sendMessage({todo: "downloadCaptions", captions: cue});

var str = document.URL;
if(str.search("youtube") != -1){
    //extract subtitles for youtube.
    videoelement = document.querySelector('video');
    videoelement.onpause = function () {
        var cues = "";
        var SubtitleWindow = document.getElementById('caption-window-1')
        if (SubtitleWindow) {
            var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
            for (i = 0; i < Subtitles.length; i++) {
                cues += Subtitles.item(i).textContent + " ";
            }
        }
        if(cues.length){
            //alert("from content : youtube: "+ cues);
            var port = chrome.runtime.connect({name: "SubtitlesContainer"});
            port.postMessage({todo: "downloadCaptions", Subtitles : cues});
        }
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
                if(cues.length){
                    //alert("from content : AmazonPrime: "+ cues);
                    var port = chrome.runtime.connect({name: "SubtitlesContainer"});
                    port.postMessage({todo: "downloadCaptions", Subtitles : cues});
                }
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

                if(cues.length){
                    //alert("from content : NetFlix: " + cues);
                    var port = chrome.runtime.connect({ name: "SubtitlesContainer" });
                    port.postMessage({ todo: "downloadCaptions", Subtitles: cues });
                }
            }
        } 
    }
}

// document.body.appendChild(getHTMLOverLay());

// function getHTMLOverLay(){
//     var moverlay = document.createElement("DIV");
//         moverlay.id = "moverlaydiv";
//         $('#moverlaydiv').css('position','none');
//         $('#moverlaydiv').css('top','0');
//         $('#moverlaydiv').css('bottom','0');
//         $('#moverlaydiv').css('left','400px');
//         $('#moverlaydiv').css('right','0');
//         $('#moverlaydiv').css('display','block');
//         $('#moverlaydiv').css('background-color','rgba(0,0,0,0.5)');
//         $('#moverlaydiv').css('color','#fff');
//         $('#moverlaydiv').css('cursor','pointer');

//     var meaningList = document.createElement("DIV");
//         meaningList.id = "meaningListDiv";
//         $('#meaningListDiv').css('overflow','auto');
//         $('#meaningListDiv').css('height','450px');
        
//     var vocablist = document.createElement("UL");
//         vocablist.id = "vocablistUL";
//         $('#vocablistUL').css('padding-right','10px');
//         $('#vocablistUL').css('padding-inline-start','10px');

//     moverlay.appendChild(meaningList);
//     meaningList.appendChild(vocablist);
//     vocablist.appendChild(getListItem("Word", "Meaning is the one that is written here"));
//     return moverlay;
// }

// function getListItem(word, meaning){
//     var vocablistItem = document.createElement("LI");
//         vocablistItem.id = "vocablistLI";
//         $('#vocablistLI').css('background-color','gray');
//         $('#vocablistLI').css('display','block');
//         $('#vocablistLI').css('margin-bottom','10px');

//     var divWord = document.createElement("DIV");
//         divWord.id = "word";
//         $('#word').css('padding-top','5px');
//         $('#word').css('padding-left','5px');
//         $('#word').css('margin-bottom','10px');
//         $('#word').text(word);

//     var iBookmark = document.createElement("I");
//         iBookmark.id = "bookmarkicon";
//         $('#bookmarkicon').css('font-size','18px');
//         $('#bookmarkicon').css('float','right');
//         $('#bookmarkicon').css('padding-right','10px');

//     var divMeaning = document.createElement("DIV");
//         divMeaning.id = "meaning";
//         $('#meaning').css('display','block');
//         $('#meaning').css('padding-top','5px');
//         $('#meaning').css('padding-bottom','5px');
//         $('#meaning').css('padding-left','5px');
//         $('#meaning').css('padding-right','5px');
//         $('#meaning').text(meaning);
//         vocablistItem.appendChild(divWord);
//             divWord.appendChild(iBookmark);
//         vocablistItem.appendChild(divMeaning);
//         return vocablistItem;
// }
