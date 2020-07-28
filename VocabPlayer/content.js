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

else if(str.search("primevideo") != -1){
    //write for prime video.
}

else if(str.search("netflix") != -1) {
    //write for netflix.
}