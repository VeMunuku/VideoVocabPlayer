chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "displaySlider"){
        //trigger UX slider with animation;

        /* For Debugging purpose
            var video = document.querySelector('video');
            video.muted = !video.muted;
            alert("Display Slider - Video Mute Status "+video.muted);
        */
    }
    else if(request.todo == 'updateSlider'){
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
        var str = "";
        var SubtitleWindow = document.getElementById('caption-window-1')
        if (SubtitleWindow) {
            var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
            for (i = 0; i < Subtitles.length; i++) {
                str += Subtitles.item(i).textContent;
            }
        }
        //alert("from content : youtube: "+ str);
        var port = chrome.runtime.connect({name: "SubtitlesContainer"});
        port.postMessage({todo: "downloadCaptions", Subtitles : str});
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