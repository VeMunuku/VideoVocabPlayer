chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "displaySlider"){
<<<<<<< Updated upstream
        //trigger UX slider with animation;

        /* For Debugging purpose
            var video = document.querySelector('video');
            video.muted = !video.muted;
            alert("Display Slider - Video Mute Status "+video.muted);
        */
        var vid = document.querySelector('video');
        vid.onpause = function() {
          //document.getElementById("overlaydiv").style.display = "block";
        };

        vid.onplay = function() {
          //document.getElementById("overlaydiv").style.display = "none";
        };
    }
    else if(request.todo == 'updateSlider'){
        //have word meanings list; split them and update
        //the UX;
=======
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
        var vidparent = document.getElementsByClassName("html5-video-container")[0];
        vidparent.innerHTML = inject_html_start + n_boxes + inject_html_end + vidparent.innerHTML;
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
>>>>>>> Stashed changes
    }
})

//Example to send message to EventPage
//chrome.runtime.sendMessage({todo: "downloadCaptions", captions: cue});

var str = document.URL;
if(str.search("youtube") != -1){
    //extract subtitles for youtube.

    videoelement = document.querySelector('video')
    if(videoelement != null){
        videoelement.onpause = function () {
            var str = "";
            var SubtitleWindow = document.getElementById('caption-window-1')
            if (SubtitleWindow) {
                var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
                for (i = 0; i < Subtitles.length; i++) {
                    str += Subtitles.item(i).textContent;
                    //alert(str);
                }
                //alert(str);
            }
            alert(str);
            chrome.runtime.sendMessage({ todo: "downloadCaptions", captions: str });
        }
    }
        

}

else if(str.search("https://www.primevideo.com/detail/") != -1 || str.search("https://www.primevideo.com/storefront/home/") != -1){
    //write for prime video.
    window.onload = function () {
        setInterval(showTime, 3000);
    }

    function showTime() {
        var video = document.querySelector('video');
        if(video){
            video.onpause = function(){
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
                /*if(cues.length)
                    alert(cues);*/
                chrome.runtime.sendMessage({todo: "downloadMeaningOfSelectedText", captions: cues});
            }
        }
    }
}

else if(str.search("netflix") != -1) {
    //write for netflix.
}