

var array = [
    
    {songName: "StarBoy", url: "Starboy.mp3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ9UFtOTjzvHifbNbdE3M7PMJuvT28PU02Wg&s"},
    {songName: "APT.", url: "ROSE & Bruno Mars - APT. (Official Music Video).mp3", image: "https://cdn-images.dzcdn.net/images/cover/258e6042338ce64bb4157c0c94b232ac/0x1900-000000-80-0-0.jpg"},
    {songName: "Heavens and Back", url: "HEAVEN AND BACK.mp3", image: "https://i1.sndcdn.com/artworks-AaxtlzzB5dSDeTwk-YPevHw-t500x500.jpg"},
    {songName: "Heat Waves", url: "Glass Animals - Heat Waves.mp3", image: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea"},
    {songName: "We Don't Talk Anymore", url: "Charlie Puth - We Don't Talk Anymore (feat. Selena Gomez) [Official Video].mp3", image: "https://cdn-images.dzcdn.net/images/cover/948200588c813c1afd10f29b56e0ce50/1900x1900-000000-80-0-0.jpg"},
    {songName: "PUSH 2 START", url: "Tyla - PUSH 2 START (Official Audio).mp3", image: "https://i1.sndcdn.com/artworks-m7I1qhX0C53zReln-JmhURw-t500x500.jpg"},
    {songName: "FEVER", url: "SpotifyMate.com - FEVER - ENHYPEN.mp3", image: "https://i1.sndcdn.com/artworks-5dne7Z52wJyiBfKH-1y02CQ-t1080x1080.jpg"},
]
var audio =  new Audio()
var selectedSong = 0;
var coverphotos = document.querySelector("#poster");
var playbutton = document.querySelector("#play")
var backwardbutton = document.querySelector("#backward")
var forwardbutton = document.querySelector("#forward")
var clicked = false;
const songSlider = document.getElementById("song-slider");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");

function addsongs(){
    var clutter = "";
    var list = document.querySelector("#songs")
    var clicking = document.querySelector("#songslist")
    array.forEach(function(elem, index){
        clutter += `<div class="songslist" id = "${index}">
                    <div id="part1">
                        <div id="cover"><img
                                src="${elem.image}"
                                alt="cover"></div>
                        <div id="songname">
                            <h4>${elem.songName}</h4>
                        </div>
                    </div>
                    </div>
                </div>`
    })
    list.innerHTML = clutter;
    audio.src = array[selectedSong].url
    coverphotos.src = array[selectedSong].image;



}
list.addEventListener("click",function(details){
    selectedSong = details.target.id
    clicked = true
    playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
addsongs();
    console.log(selectedSong)
audio.play()
})
playbutton.addEventListener("click", function(){
    if(!clicked){
    playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
    clicked = true;
    audio.play()
    }
    else{
    playbutton.innerHTML = `<i class="ri-play-fill"></i>`
    clicked = false
        audio.pause()
    }

})
forwardbutton.addEventListener("click",function(){
    // Arrays are zero-indexed, so the last valid index is array.length - 1.
// If we just use array.length, selectedSong can go out of bounds (e.g., index 3 for a length of 3).
// Using array.length - 1 ensures selectedSong stays within the valid range.
    if(selectedSong < array.length -1 ){
    playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
    clicked = true
        selectedSong++
        addsongs();
        audio.play()

    }
    else{
        selectedSong = 0;
    playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
    clicked = true
        addsongs();
        audio.play()
    }
})
backwardbutton.addEventListener("click", function(){
    if (selectedSong > 0){
        selectedSong--
        playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
    clicked = true
        addsongs();
        audio.play()
    }
    else{
        selectedSong = array.length-1
        playbutton.innerHTML = `<i class="ri-pause-large-line"></i>`
        clicked = true
            addsongs();
            audio.play()
    }


})

// CHAT GPT

function createHearts(event) {
    const heartCount = 1;  // Number of hearts to create at each click
    const heartContainer = event.currentTarget;  // This will refer to the cover photo div
    
    for (let i = 0; i < heartCount; i++) {
        // Create a heart element
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Randomize the size of each heart slightly for effect
        heart.style.fontSize = `${Math.random() * 109 + 20}px`;
        
        // Get the click position relative to the #coverphoto container
        const rect = heartContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Position the heart near the click position within the cover photo
        heart.style.left = `${clickX - 15 + Math.random() * 10}px`;  // Adding slight randomness
        heart.style.top = `${clickY - 15 + Math.random() * 40}px`;

        // Append the heart to the #coverphoto container
        heartContainer.appendChild(heart);

        // Remove the heart after animation completes (2s)
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
}

audio.addEventListener("timeupdate", () => {
    // Set the value of the slider based on the current time
    songSlider.value = audio.currentTime;

    // Format the time to show minutes:seconds
    const currentTimeFormatted = formatTime(audio.currentTime);
    currentTimeDisplay.textContent = currentTimeFormatted;

    const totalTimeFormatted = formatTime(audio.duration);
    totalTimeDisplay.textContent = totalTimeFormatted;
});

// Format the time as minutes:seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsFormatted = Math.floor(seconds % 60);
    return `${minutes}:${secondsFormatted < 10 ? '0' + secondsFormatted : secondsFormatted}`;
}

// Update the song's current time when the slider is moved
songSlider.addEventListener("input", (event) => {
    audio.currentTime = event.target.value;
});

// Update the slider max value once the song is loaded (on metadata loaded)
audio.addEventListener("loadedmetadata", () => {
    songSlider.max = audio.duration;
});

// When the song ends, reset the slider
audio.addEventListener("ended", () => {
    songSlider.value = 0;
    currentTimeDisplay.textContent = "0:00";
});



addsongs();
