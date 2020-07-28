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

var str = document.URL;;
if(str.search("youtube") != -1){
    //extract subtitles for youtube.
    videoelement = document.querySelector('video')
    videoelement.onpause = function () {
        var cues = "";
        var SubtitleWindow = document.getElementById('caption-window-1')
        if (SubtitleWindow) {
            var Subtitles = SubtitleWindow.getElementsByClassName("ytp-caption-segment");
            for (i = 0; i < Subtitles.length; i++) {
                cues += Subtitles.item(i).textContent;
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