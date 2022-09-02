// Declaration of MOST required elements 
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    repeatBtn = wrapper.querySelector("#repeat-plist"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close"),
    ulTag = wrapper.querySelector("ul");

// This is to load random music each time the page refreshes
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);


//ALL EVENTS
// 1.Event happens when page load :) This will call the specific function when the site loads
window.addEventListener("load", () => {
    loadMusic(musicIndex); // Clling the load music function
    playingNow();
});
// 2. Play music event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic(); // If pause music == true then call pauseMusic.. If not call playMusic
    playingNow();
});
// 3. Plays the previos song
prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow();
});
// 4. Plays the next song
nextBtn.addEventListener("click", () => {
    nextMusic();
    playingNow();
});
// 5. Updating progress bar based on the current music time :)
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // This gets the current time of the song
    const duration = e.target.duration; // While this gets the duration of the song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    mainAudio.addEventListener("loadeddata", () => {

        let musicDuration = wrapper.querySelector(".duration");

        // Updating of song`s duration
        let audioDuration = mainAudio.duration,
            totalmin = Math.floor(audioDuration / 60),
            totalsec = Math.floor(audioDuration % 60);
        if (totalsec < 10) { // Helps to properly format seconds if it`s less than 10 
            totalsec = `0${totalsec}`;
        }
        musicDuration.innerText = `${totalmin}:${totalsec}`;
    });
    // Now let`s update the current playing time of the song haha
    let currentmin = Math.floor(currentTime / 60),
        currentsec = Math.floor(currentTime % 60);
    if (currentsec < 10) {
        currentsec = `0${currentsec}`;
    }
    musicCurrentTime.innerText = `${currentmin}:${currentsec}`;
});
// 6. An attempt to update the song`s current play time with progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; //retrieves width of progress bar
    let clickedOffSetX = e.offsetX; // getting the offset value of x
    let songDuration = mainAudio.duration; // and we have to get the song`s duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});
// 7. Working on repeat and shuffle button
repeatBtn.addEventListener("click", () => {
    // So now it would be best to get the innertext of the icon and change as needed
    let gettxt = repeatBtn.innerText;
    // And do changes on it using a switch
    switch (gettxt) {
        case "repeat": // Happens if the icon is called repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one": // Happens if the icon is called repeat_one
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title", "Playlist Shuffled");
            break;
        case "shuffle": // Happens if the icon is called shuffle
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist Looped");
    }
});
// 8. Working on what the program should do once the song had ended
mainAudio.addEventListener("ended", () => {
    let gettxt = repeatBtn.innerText; // Time to get inner text again

    switch (gettxt) {
        case "repeat": // If the icon says repeat then please just call the next music function so the next song can be played
            nextMusic();
            break;
        case "repeat_one": // If it says repeat once the say current song
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle": // If it says shuffle then it randomly generates an index number within array number
            let randomindex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomindex = Math.floor((Math.random() * allMusic.length) + 1); // This runs until random number isnt the same as current index
            } while (musicIndex == randomindex);
            musicIndex = randomindex; // Passing the random index into music index so a random song will be played
            loadMusic(musicIndex); // Remember to call the laod music function
            playMusic(); // and also play music
            playingNow();
            //DO NEXT BUTTON EVENT LISTEN TO FIX SHUFFLE A REMINDER
            break;
    }
});
// 9. Shows music queue
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
// 10. Hides music queue
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

//ALL FUNCTIONS
// 1.This function loads the music and inforation about it
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.m4a`;
}
// 2. This function plays the music
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = 'pause';
    mainAudio.play();
}
// 3. This function pauses the music 
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = 'play_arrow';
    mainAudio.pause();
}
// 4. This function calls the previous song| basically decreases the index by 1
function prevMusic() {
    musicIndex--;

    // So this is basically that if the music index is less than 1 then it goes to the largest index number
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
// 5. This function calls the next song| will basically increase the index by 1
function nextMusic() {
    musicIndex++;

    // If the music index is greater than length of array then music index shall be 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;

    let shuffletest = repeatBtn.innerText;

    if (shuffletest =="shuffle"){ // This checks to see if shuffle is enabled, if it is then the enxt song is randomized
        do {
            randomindex = Math.floor((Math.random() * allMusic.length) + 1); // This runs until random number isnt the same as current index
        } while (musicIndex == randomindex);
        musicIndex = randomindex; // Passing the random index into music index so a random song will be played
        loadMusic(musicIndex); // Remember to call the laod music function
        playMusic(); // and also play music
        playingNow();
    }
    loadMusic(musicIndex);
    playMusic();
}
// 6. This function is to play the song on li click
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index"); // This is to get the index of the cliked li tag
    musicIndex = getLiIndex; // Now we have to pass the value on to musicIndex variable
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
// 7.

function playingNow() {
const allLiTags = ulTag.querySelectorAll("li");
    // Feature to play specific song on click from list

    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // To remove playing now class from songs not being played
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            // So now we have to get the audio duration to put it back lol
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText=adDuration;
        }
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText="Playing...";
            
            
        }

        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }

}
// MISC
// 1. Time to create lists according to array length
for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index=${i + 1}>
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.m4a"></audio>
    <span id="${allMusic[i].src}" class="audio-duration"></span>
</li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration,
            totalmin = Math.floor(audioDuration / 60),
            totalsec = Math.floor(audioDuration % 60);
        if (totalsec < 10) { // Helps to properly format seconds if it`s less than 10 
            totalsec = `0${totalsec}`;
        }
        liAudioDuration.innerText = `${totalmin}:${totalsec}`;
        liAudioDuration.setAttribute("t-duration",`${totalmin}:${totalsec}`)
    });
}

