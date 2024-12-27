// dom = document object model

// this is front end js

// 44 pillars of dom

// Selection of element
// changing html
// changing css
// event listener

// document ke andr ksi querry ko selelct krlo
var a = document.querySelector("h1");
// id ke liye # or class ke liye .
console.log(a);


// changing html
var a =document.querySelector("h1")
a.addEventListener("click", function(){
    a.innerHTML = "Dom manipulation"
    a.style.color = "white"
    a.style.backgroundColor = "black"

})



// changing css

a.style.color = "black"
// this is written here in the form of camel case
a.style.backgroundColor = "red"
// - ke bad wala letter capital


// event listener




// kch is treqe se chale ga smjhe



// if we want to select all the h1 in the html then for that we use

var b = document.querySelectorAll("h1")

// these are basically saved in nodelists

b.forEach(function(h1){
    h1.style.fontSize = "44px"
})
var green = false
var c = document.querySelector("button")
c.addEventListener("click",function(){
    if(!green){
    b.forEach(function(h1){
        h1.style.color = "green"
        green = true
        
    })}
    else{
        b.forEach(function(h1){
            h1.style.color = "lightblue"
            green = false
    })
}
  
})

// we cannot do it directly by b.style but we have to loop thorugh each element

var clicked = false
a.addEventListener("click", function(){
    
    if(!clicked){
        a.style.color = "black"
        a.style.backgroundColor = "red"
        clicked = true
    }
    else{
        a.style.color = "white"
        a.style.backgroundColor = "black"
        clicked = false
        a.innerHTML = "Chal bsdk"
    

}})

// h1 ko agr ham dalen ke uske code ke sath js me to wo uska tag me convert hokr dikhega
var box = document.querySelector("#box")
box.innerHTML = "<h1>Hello Bitch</h1>"

// but if we want the exact text then 
// we use text content property

box.textContent = "</h1>Kiya haal chal he</h1>"

// live server onn krke dekhli
