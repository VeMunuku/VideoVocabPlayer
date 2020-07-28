chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "displaySlider"){
        //trigger UX slider with animation;

        /* For Debugging purpose
            var video = document.querySelector('video');
            video.muted = !video.muted;
            alert("Display Slider - Video Mute Status "+video.muted);
        */
        var vid = document.getElementById("video");
        vid.onpause = function() {
          document.getElementById("overlaydiv").style.display = "block";
        };

        vid.onplay = function() {
          document.getElementById("overlaydiv").style.display = "none";
        };
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
}

else if(str.search("primevideo") != -1){
    //write for prime video.
}

else if(str.search("netflix") != -1) {
    //write for netflix.
}