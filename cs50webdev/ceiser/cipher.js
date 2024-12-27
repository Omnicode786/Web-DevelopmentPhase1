var submit = document.querySelector("button")
var p1 = document.querySelector("p")
var h3 = document.querySelector("h3")
p1.style.visibility = "hidden"
submit.addEventListener("click", function () {

    var message = document.querySelector("#Message")
    let result = ""
    for (let i = 0; i < message.value.length; i++) {
        let char = message.value[i]
        if (char >= 'A' && char <= 'Z') {
            result += String.fromCharCode(((char.charCodeAt(0) - 65 + 3) % 26) + 65)
        }
        else if (char >= 'a' && char <= 'z') {
            result += String.fromCharCode(((char.charCodeAt(0) - 97 + 3) % 26) + 97)
        }

        else {
            result += char;
        }
    }
    p1.style.visibility = ""

    h3.innerHTML = "<u>Your Ciphered Text!</u>"
    p1.innerHTML = result
    // All the logic behind this!!!!
    // Lets show you all the other files as well!!
}) 