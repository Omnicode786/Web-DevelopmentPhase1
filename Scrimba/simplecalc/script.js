var num1 = document.querySelector("#num1")
var num2 = document.querySelector("#num2")
var type = document.querySelector("#type")
var result = document.querySelector("#result")

function add(){
    if(checknul()) return;
            type.textContent = "Addition Result";
            adder = num1.valueAsNumber + num2.valueAsNumber;
            result.textContent = adder;
}
function Subtract(){
    if(checknul()) return;
    type.textContent = "Subtraction Result";
    subtractor = num1.valueAsNumber - num2.valueAsNumber;
    result.textContent = subtractor;
}
function Multiply(){
    if(checknul()) return;
    type.textContent = "Multiplication Result";
    multiplier = num1.valueAsNumber * num2.valueAsNumber;
    result.textContent = multiplier;

}
function Divide(){
    if(checknul()) return;
    type.textContent = "Division Result";
    divider = num1.valueAsNumber / num2.valueAsNumber;
    result.textContent = divider;
}

function checknul(){
    if(isNaN(num1.valueAsNumber)||isNaN(num2.valueAsNumber)){
        type.textContent = "Enter a valid number";
        result.textContent = ""
        return 1;
    }
    else{
        return 0;
    }
}