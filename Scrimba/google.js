searchbutton = document.querySelector("#btn1")
entersearch = document.querySelector("#searchengine")
wholepage = document.querySelector("#container")
button2 = document.querySelector("#btn2")
toggle = document.querySelector("#img2")
console.log(entersearch.value)

function search(){
    const querry = entersearch.value
    const searchURL = `https://www.google.com/search?q=${encodeURIComponent(querry)}`;
    window.location.href = searchURL
 

}
entersearch.addEventListener("keydown",function(){
    if(event.key == "Enter"){
        search();
    }
})

click = false;
toggle.addEventListener("click", function(){
    if (!click){
        toggle.innerHTML = `<i class="ri-sun-line"></i>`
        click = true
    wholepage.style.backgroundColor = "rgb(45, 46, 46)"
    searchbutton.style.backgroundColor = "#383535"
    searchbutton.style.color = "white"
  button2.style.backgroundColor = "#383535"
    button2.style.color = "white"
    entersearch.style.backgroundColor = "rgb(104, 105, 105)"
    entersearch.style.color = "white"
    }
    else{
        click = false
        toggle.innerHTML = `<i class="ri-moon-fill"></i>`
        wholepage.style.backgroundColor = "white"
        searchbutton.style.backgroundColor = "rgb(241, 230, 230)"
        searchbutton.style.color = "black"
        button2.style.backgroundColor = "rgb(241, 230, 230)"
        button2.style.color = "black"
        entersearch.style.backgroundColor = "rgb(237, 245, 245)"
    entersearch.style.color = "black"
    
    }

})

