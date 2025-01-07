let wholebody = document.querySelector("*");
let toggler = document.querySelector("#toggle");
let introduction = document.querySelector("#intro")
let about1 = document.querySelector("#about")
let icons = document.querySelectorAll(".iconic")
let Allborders = document.querySelectorAll("*");


let click = false
toggler.addEventListener("click", function () {
    if (!click) {
        toggler.src = "light.png";
        wholebody.style.backgroundColor = "rgb(31, 28, 28)";
        wholebody.style.color = "white"
        introduction.style.backgroundColor = "rgb(31, 28, 28)";
        about1.style.backgroundColor = "rgb(31, 28, 28)";
     
        Allborders.forEach(function(border){
            border.style.borderColor = "white"
        })
        click = true
        
    }   
    else{
        toggler.src = "night.png";
        wholebody.style.backgroundColor = "rgb(255, 255, 255)";
        wholebody.style.color = "black"
        introduction.style.backgroundColor = "rgb(238, 235, 235)";
        about1.style.backgroundColor = "azure";
     
        Allborders.forEach(function(border){
            border.style.borderColor = "black"
        })
        click = false
    }

})
