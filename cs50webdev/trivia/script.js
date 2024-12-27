var ans = "31";
var buttons = document.querySelectorAll(".part1");
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        buttons.forEach(function (btn) {
            btn.disabled = true;
            btn.style.cursor = "not-allowed"

        });
        if (button.innerHTML == ans) {
            button.style.backgroundColor = "green";
            document.querySelector("#p1").innerHTML = "Correct!"
        }
        else {
            button.style.backgroundColor = "red";
            document.querySelector("#p1").innerHTML = "Incorrect!"
        }
    });
})
var submit = document.querySelector("#part2")
var ans2 = "elon musk"
var obtain2 = document.querySelector("#obtained2")

submit.addEventListener("click", function () {

    if (obtain2.value.toLowerCase() == ans2) {
        document.querySelector("#p2").innerHTML = "Correct"
        obtain2.style.backgroundColor = "green"
        obtain2.style.color = "white"

    }
    else {
        document.querySelector("#p2").innerHTML = "Incorrect"
        obtain2.style.backgroundColor = "red"
        obtain2.style.color = "white"


    }
})
