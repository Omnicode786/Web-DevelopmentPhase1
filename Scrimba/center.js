Toggle = document.querySelector("img")
wholebody = document.querySelector("body")


click = false
Toggle.addEventListener("click", function(){
    if(!click){
    wholebody.style.backgroundColor = "rgb(48, 47, 47)"
    Toggle.src = "light.png"
    click = true
    }
    else{
          wholebody.style.backgroundColor = "rgb(255, 255, 255)"
    Toggle.src = "night.png"
    click = false
    }
})