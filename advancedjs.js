// all the basic are somewhere else ok


// Higher order functions in js

// Higher order functions are those which accept a function in a parameter

function Higher(){
return function(){}
}

Higher(function(){})
// we can also pass a function as a parameter
// or it returns a function 
// this is done when we make closures

// aisa func jo accept krle ak aur fnc ya fir wo return krde ek aur func
// aise ko higher orde rkehte hen
var arr = [1,2,3,4,5];
arr.forEach(function(val){
    console.log(val+4);

})
// here for each ais a higher order functions

// constructor function


// normal func jismain this ka use ho and ap func call krte waqt new ka keyword istemal kre that is 
//
function instanceoffunction(){
    this.width = 12;
    this.height = 22;
    this.color = "brown";
    this.taste = "sugary";
}

var biscuit1 = new instanceoffunction();
// jitni bar new likhen ge utni bar bnagea
var biscuit2 = new instanceoffunction();
var biscuit3 = new instanceoffunction();

 console.log(biscuit1);
 console.log(biscuit2);
 console.log(biscuit3);

// basically copy wala scene he any instant when we need to create many elements of same properties here constructor function is used

// let's say tv remote circles rgb

function tvremotebtns(color){
    this.radius = 2.2;
    this.color = color;
    this.pressable = true;
    this.icon = false;
}

var redbtn =new  tvremotebtns("red");
var greenbtn =new  tvremotebtns("green");
var bluebtn = new tvremotebtns("blue");
// if we donnew t put new above then it will give us
console.log(redbtn);
console.log(greenbtn);
console.log(bluebtn);
// a function when called with a new keywords then that gives us an obejct if we use the this keyword inside that function it return s an object with all of the proeprties and methods such function is constructor function


// What is First class functions

// A lamguage is sadi to have first class functions when the functions can be treated as  variables you can save them and you can pass them as arguments to another functions
// in js functions are first class
var fistclass = function(){

}

// New Keywords


// new =  creates a new imaginary blank object
// and then run the code right next to it


// iife = immediately invoked function expression
// iife hai function ko foran chalane ki ability
// so that we can create a private varaible
// immediately called


var ans = (function(){
    var private = 21;
    // // return {} this is blank object
    // return {
    //     age: 12 
    // } now age 12 will be returned and  ans will hold age 12 value as an object
    // but instead we are gonna do this
    return{
        getter: function(){
            console.log(private);
        }, //getter is used to get the private variables iife me har variable automatic private hojata he
        // ye variable srf or srf iife ke andr access ho skta he

        // setter works similarly in c++

        setter: function(value){
            private = value;
        } 

    }

})()// this is iife
// even thought we have defined a we cannot access it it creates a private variable
// this makes code safer and private
console.log(ans.getter());
ans.setter(333);
console.log(ans.getter());


// Prototype

//Every createed object get's a property called prototype
// thiws is by default  prototype to every object every object contains a prototype

// prototype has many helper properties

// prototypal inheritance



var Human = {
    name: "",
    CanFly: false,
    cantalk: true,
    canwalk: true,
    haveemotions: true,
    hasfourlegs: false
}

var specialhuman = {
    makewebsites: true,
    makeanimations: true,
    cansing: true
}
specialhuman.__proto__ = Human;

// this prototypal inheritance



// Understanding this keyword

// this ketyword is a special ketywrd in js whihc jchanges its valuein diffeent context

// Global scope
// woi wala scene { } () ye wla scene
// inke andr hongi to wo local scope meri jan ke tote

// in global scope this means is from window

// we should know tis valuein all conte4xts

// global scope this = window

console.log(this);
// function scope this = window
function letsseethisvalue(){
    console.log(this);
}
// method scope = when a function is in a object is caleld a method

var object1 = {

    name: "Muzammil",
    age: 18,
    method: function(){
        console.log(this);
    }
}
object1.method();
// in method scope this = object the whole object properties will be copied in this sense to this   

// in any method this keyword always refer to the parent object

// Event listeners

var button = document.querySelector("button");
button.addEventListener("click", function(){
    console.log(this);
})
button.addEventListener("click", function(){
    this.style.height = "44%";
    this.style.width = "60%";
    this.style.backgroundColor = "lightblue";
    button.innerHTML = "I Wasnt home bish";
    this.style.color = "red";
})
// this keyword is equal to whatever written befoe the addeventlistener like 
// let's say if its button here then this will refer to button if it was h1 then it woukld be h1
// this will refer tot he complete button code 

// call apply bind = if i have a function and i have one object and i need to run a function and by default jo this ki value window he usko point krwane he ksi object ki trf

function changethis(val1, val2, val3){
    console.log(this, val1, val2, val3);
    // now because of the below  code we can also do this
    console.log(this.CanFly);// this will only work if i were to send int he human or special human object
}
var object2 = {age:18};

// abhi tak this will be window meri jan ke tote 
//but after we do the call thing we can decide what "this" is

changethis.call(object2);
changethis.call(specialhuman);
changethis.call(specialhuman,12,22,33);


// this was call

// now coming towards apply

changethis.apply(object2, [1,2,3]);
// we are jsut writing it in array but only going it in val this
// is simply to give us programmers a way to use only two parameters the array would not go in the individual val instead the individual data of the array like first will go to the first parameter so on and so fourth


// bind
// bind is used a lot in react

var bindedfunc = changethis.bind(object2);
// bind basically does not call it like it binds the two functions this can be saved to a variable as every function is first class function
bindedfunc();


// pure and impure functions

// pure and uimpure has these two things

function pureimpure(value){
    return Math.random()*value;
}
var ans10 = pureimpure(2);
var ans10 = pureimpure(2);

// this will obviously not give same value upon running with the same parameter again probably


// a pure function will not change the global value is pure function
// if we change the global value variable in a function than that is an impure function


