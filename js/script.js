// Declaration of all required elements 
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar");

let musicIndex = 1;


//ALL EVENTS
// 1.Event happens when page load :) This will call the specific function when the site loads
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});
// 2. Play music event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic(); // If pause music == true then call pauseMusic.. If not call playMusic
});
// 3. Plays the previos song
prevBtn.addEventListener("click", () => {
    prevMusic();
});
// 4. Plays the next song
nextBtn.addEventListener("click", () => {
    nextMusic();
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
    loadMusic(musicIndex);
    playMusic();
}

