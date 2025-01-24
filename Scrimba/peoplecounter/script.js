var toincrement = document.querySelector("#toincrement");
var adder = document.querySelector("#add");
var subtractor = document.querySelector("#subtract");

var people = 0;
adder.addEventListener("click", function(){
    people += 1;
    toincrement.innerHTML = people;
})
subtractor.addEventListener("click", function(){
    if (people > 0){
        people -= 1;
        toincrement.innerHTML = people;
    }
    
})
