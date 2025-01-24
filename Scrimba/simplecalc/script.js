var num1 = document.querySelector("#num1")
var num2 = document.querySelector("#num2")
var type = document.querySelector("#type")
var result = document.querySelector("#result")

function add(){
            type.textContent = "Addition Result";
            adder = num1.valueAsNumber + num2.valueAsNumber;
            result.textContent = adder;
}
function Subtract(){
    type.textContent = "Subtraction Result";
    subtractor = num1.valueAsNumber - num2.valueAsNumber;
    result.textContent = subtractor;
}
function Multiply(){
    type.textContent = "Multiplication Result";
    multiplier = num1.valueAsNumber * num2.valueAsNumber;
    result.textContent = multiplier;

}
function Divide(){
    type.textContent = "Division Result";
    divider = num1.valueAsNumber / num2.valueAsNumber;
    result.textContent = divider;
}