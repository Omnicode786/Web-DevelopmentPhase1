

var array = [
    
    {songName: "StarBoy", url: "Starboy.mp3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ9UFtOTjzvHifbNbdE3M7PMJuvT28PU02Wg&s"},
    {songName: "APT.", url: "ROSE & Bruno Mars - APT. (Official Music Video).mp3", image: "https://cdn-images.dzcdn.net/images/cover/258e6042338ce64bb4157c0c94b232ac/0x1900-000000-80-0-0.jpg"},
    {songName: "Heavens and Back", url: "HEAVEN AND BACK.mp3", image: "https://i1.sndcdn.com/artworks-AaxtlzzB5dSDeTwk-YPevHw-t500x500.jpg"},
    {songName: "Heat Waves", url: "Glass Animals - Heat Waves.mp3", image: "https://i.scdn.co/image/ab67616d0000b2739e495fb707973f3390850eea"},
]

var audio =  new Audio()
var selectedSong = 0;
var coverphotos = document.querySelector("#poster");
var playbutton = document.querySelector("#play")
var backwardbutton = document.querySelector("#backward")
var forwardbutton = document.querySelector("#forward")
var clicked = false;


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
                    <div id="part2">
                        <h5>3:09</h5>
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
        addsongs();
        audio.play()
    }
})




addsongs();
