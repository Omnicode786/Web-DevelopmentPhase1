document.querySelector("body")
let h1 = document.createElement("h1")
let input = document.createElement("input")
h1.innerHTML = "Enter the thing to change"
document.body.innerText = '';
document.body.appendChild(h1)
document.body.appendChild(input)
function change(){
    h1.innerHTML = input.value
}
input.addEventListener("change", change)