var cues = "";
var video_paused = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.todo == "displaySlider") {
        if(video_paused == false)
            return;
        //alert("Got display request. Displaying UX... " + request.nitems + " items to display");
        var video = document.querySelector("video");
        var h = video.offsetHeight;
        height_moverlay = h+"px";
        var inject_html_start = '<div id="video_overlays" style="display:none;position:absolute;top:0;bottom:0;right:0;background-color:rgba(0,0,0,0.5);width:40%;height:'+height_moverlay+';">';
        //$("#video_overlays").css('height',height_moverlay);
        var inject_html_end = '</div>';
        var meaningslist_start = '<div id="meaningslist" style="overflow: auto;height:'+height_moverlay+';">';
        var meaningslist_end = '</div>';
        var vocablist_start = '<ul id="vocablist" style="padding-right:10px;padding-inline-start:10px;">';
        var vocablist_end = '</ul>';
        var one_empty_box = '<li id="LIID" onclick="event.stopPropagation()" style="background-color: rgba(255,255,255,0.7);display: block;margin-bottom: 10px;position: relative;height: 120px;width: auto;margin-bottom: 10px;"><p style= "padding-top: 10px;padding-left: 10px;font-size: 20px;font-style: sans-serif;font-family: sans-serif;color: black;" id="PID_WORD">Loading...</p><hr><p style= "padding-top: 10px;padding-left: 10px;font-size: 15px;font-style: sans-serif;font-family: sans-serif;color: black;" id="PID_MEANING"></p><hr><p  style= "padding-top: 10px;padding-left: 10px;font-size: 15px;font-style: sans-serif;font-family: sans-serif;color: black;" id="PID_TRANS"></p></li>';

        //var one_empty_box = '<li><div><p id="PID_WORD">Word</p><p id="PID_MEANING">Meaning</p><p id="PID_TRANS">Translation</p></div></li>';
        var n_boxes = ''
        for (i = 0; i < request.nitems; i++) {
            var my_empty_box = (' ' + one_empty_box).slice(1);
            my_empty_box = my_empty_box.replace("LIID", "LIID_" + i);
            my_empty_box = my_empty_box.replace("PID_WORD", "PID_WORD_" + i);
            my_empty_box = my_empty_box.replace("PID_MEANING", "PID_MEANING_" + i);
            my_empty_box = my_empty_box.replace("PID_TRANS", "PID_TRANS_" + i);
            n_boxes += my_empty_box;
        }
        //var video = document.querySelector("video");
        var next = inject_html_start + meaningslist_start + vocablist_start + n_boxes + vocablist_end + meaningslist_end + inject_html_end;
        video.insertAdjacentHTML('afterend', next);
        $("#video_overlays").fadeIn();

        for (i = 0; i < request.nitems; i++) {
            var lielement = document.getElementById("LIID_" + i);
            lielement.addEventListener("click", function(a, b){
                var collection = a.currentTarget.getElementsByTagName('p');
                var word = "";
                var meaning = "";
                var translated = "";
                if(collection){
                    for(var i = 0; i < collection.length; i++){
                        var pelement = collection.item(i);
                        if(i == 0)
                            word = pelement.textContent;
                        else if(i == 1)
                            meaning = pelement.textContent;
                        else if(i == 2)
                            translated = pelement.textContent;
                    }
                    var res = word.split("/");
                    var d = new Date();
                    var date = d.getMonth() + "/" + d.getDay()+"/"+d.getFullYear();
                    var payload = {"Word": res[0],"Meaning": meaning,"Translated": res[1],"Caption": cues,"Date": date};
                    addBookmark(payload);
                }
            });
        }
        console.log(next);
    }

    else if (request.todo == 'updateSlider') {
        //alert("Got words request. Updating UX... " + JSON.stringify(request.meaning));
        var thisindex = request.meaning.index;
        var wordID = "PID_WORD_" + thisindex;
        var meaningID = "PID_MEANING_" + thisindex;
        var transID = "PID_TRANS_" + thisindex;
        //alert(wordID + meaningID + transID);
        var wordp = document.getElementById(wordID);
        var meaningp = document.getElementById(meaningID);
        var transp = document.getElementById(transID);

        // check for error boxes. and get rid of them.
        if(request.meaning.meaning == "error"){
            var delme = wordp.parentElement;
            if(delme){
                delme.querySelectorAll('*').forEach(n => n.remove());
                delme.remove();
            }    
        }
//        alert(wordID + meaningID + transID);
        wordp.innerHTML = request.meaning.word;
        meaningp.innerHTML = request.meaning.meaning;
        // transp.innerHTML = ""; // none for now.
        wordp.innerHTML += " / " + request.meaning.trans;
    }
})

//Example to send message to EventPage
//chrome.runtime.sendMessage({todo: "downloadCaptions", captions: cue});

var str = document.URL;
if (str.search("youtube") != -1) {
    //extract subtitles for youtube.
    videoelement = document.querySelector('video');
    if (videoelement) {
        videoelement.onpause = function () {
            cues = "";
            var SubtitleWindow = document.getElementById('caption-window-1')
            if (SubtitleWindow) {
                var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
                for (i = 0; i < Subtitles.length; i++) {
                    cues += Subtitles.item(i).textContent + " ";
                }
            }
            if (cues.length) {
                video_paused = true;
                //alert("from content : youtube: "+ cues);
                var port = chrome.runtime.connect({ name: "SubtitlesContainer" });
                port.postMessage({ todo: "downloadCaptions", Subtitles: cues });
            }
        }

        videoelement.onplay = function () {
            video_paused = false;
            var delme = document.getElementById("video_overlays");
            if (delme) {
                delme.querySelectorAll('*').forEach(n => n.remove());
                delme.remove();
            }
        }
    }
}
else if (str.search("https://www.primevideo.com/") != -1) {
    //write for prime video.
    //video container is delayed
    window.onload = function () {
        setInterval(showTime, 3000);
    }
    function showTime() {
        var videoelement = document.querySelector('video');
        if (videoelement) {
            videoelement.onpause = function () {
                cues = "";
                var SubtitleWindow = document.getElementsByClassName("atvwebplayersdk-captions-text fg8afi5");
                if (SubtitleWindow) {
                    var spansc = SubtitleWindow.item(0);
                    if (spansc) {
                        var Subtitles = spansc.getElementsByTagName('span');
                        for (i = 0; i < Subtitles.length; i++) {
                            cues += Subtitles.item(i).textContent + " ";
                        }
                        //sometime subs are int parent class fg8afi5 and not in span
                        if (!cues.length) {
                            cues = spansc.textContent + " ";
                        }
                    }
                }

                if (!cues.length) {
                    var SubtitleWindow = document.getElementsByClassName("persistentPanel");
                    if (SubtitleWindow) {
                        var spansc = SubtitleWindow.item(0);
                        if (spansc) {
                            var spans = spansc.getElementsByTagName('span');
                            if (spans.item(1)) {
                                cues = spans.item(1).textContent;
                            }
                        }
                    }
                }
                if (cues.length) {
                    video_paused = true;
                    //alert("from content : AmazonPrime: " + cues);
                    var port = chrome.runtime.connect({ name: "SubtitlesContainer" });
                    port.postMessage({ todo: "downloadCaptions", Subtitles: cues });
                }
            }

            videoelement.onplay = function () {
                video_paused = false;
                var delme = document.getElementById("video_overlays");
                if (delme) {
                    delme.querySelectorAll('*').forEach(n => n.remove());
                    delme.remove();
                }
            }
        }
    }
}
else if (str.search("https://www.netflix.com/") != -1) {
    //write for netflix.
    //video container is delayed
    window.onload = function () {
        setInterval(showTime, 3000);
    }
    function showTime() {
        videoelement = document.querySelector('video')
        if (videoelement) {
            videoelement.onpause = function () {
                cues = "";
                var SubtitleWindow = document.getElementsByClassName('player-timedtext-text-container')
                if (SubtitleWindow) {
                    var spansc = SubtitleWindow.item(0);
                    if (spansc) {
                        var Subtitles = spansc.getElementsByTagName('span');
                        for (i = 0; i < Subtitles.length; i++) {
                            cues += Subtitles.item(i).textContent + " ";
                        }
                    }
                }

                if (cues.length) {
                    video_paused = true;
                    //alert("from content : NetFlix: " + cues);
                    var port = chrome.runtime.connect({ name: "SubtitlesContainer" });
                    port.postMessage({ todo: "downloadCaptions", Subtitles: cues });
                }
            }
            
            videoelement.onplay = function () {
                video_paused = false;
                var delme = document.getElementById("video_overlays");
                if (delme) {
                    delme.querySelectorAll('*').forEach(n => n.remove());
                    delme.remove();
                }
            }
        }
    }
}

function addBookmark(newBookmark){
    chrome.storage.sync.get('bookmarkedWords', function(bookmarked){
        newList = [];
        if(bookmarked.bookmarkedWords){
            newList = bookmarked.bookmarkedWords;
        }
        newList.push(newBookmark);
        chrome.storage.sync.set({'bookmarkedWords': newList});
    });
}