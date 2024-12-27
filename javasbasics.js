//<!-- word vs keyword -->

//-- Muzammil is a word -->
//-- if for else var let are keywords -->

//-- anything which has some meaning in the language that is a keyowwrd basically -->
// variables and constants -->

// code main koi bhi data sotre krne ke liye jiska use hota he wo variable he meri jan k etotte ye ku likh rhe ho bcho wala

/* */ 

var dulha = "Muzammil"
var dulhan = "Afia"
// this is not a constant vvariable meaning it's value can be changes now
const  abchangekr = "Muzammil Alam"
const krkedikha = "Afia" 
console.log(dulha + " weds " + dulhan)
console.log(abchangekr + " weds " + krkedikha)
// var and let se variables bnte hen or const se bnte hen constants omg woowww so beautiful 
let dulha1 = "Taha"
let dulhan1 = "Imam sahab"
console.log(dulha1 + " weds " + dulhan1)

// hoisting
// variable and functions are hoisted which means there declaration is moved on the top of the code
// variable ko bnane se pehle use kr skte as in line 5 pr bnaya pr line 4 pr use kr skte hen baki programmming langs me possible ni he but isme he
console.log(a);
var a = 12; //error ni mila undefined mila
// declaration would be moved to the top this is converted to two codes as in declaration and initialization
// undefined and not defined have difference undifined is when when we have that particular thing but we dont know its value it exists
// major difference betweeen undefined and not defined
var b = 22;
// hoisiting har value ke sath hoti he declration top pr jati he pr value undifine rehti he smjhe meri jan ke tote

// types in js

// primitive and reference

// primitives = Number, string, null, undefined, boolean
// reference = [] () {}
// ausu koi bhi value jisko copy karne par real copy ni hota balki us main value ka reference pass hojata he use ham reference value kehta hain aur jiska copy prne pr real copy hojaye wo primitive hota he
// basically tum ye dekho meri jan ke tote ye c c++ wala hi scene he

var c = 204;
var d = c;
b = b+2;

var e = [1,2,3,4];
// e ke pas khudka 1 2 3 4 he

// the above one is array
// when bracket values are added they are not copied directly they are always passed by refernce type
var f = e;
// f ke pas e ka 1 2 3 4 he

// b se akhri value hatana pop

f.pop(); 
// us se ab e se bhi akhri value nkl jayegi dekhna chahte ho
// ye reference kiu trah pass hui thin values

console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e);
console.log(f);


// conditionals

// if else if else ternary switch
// agart magar yr programming basics meri jan ke tote
if(10>11)
{
    console.log("Itna bhi ni pta he tmhe ");
}else if(12>13)
{
    console.log("thek hena");
}
else{
    console.log("achaanaaa");
}
    // bracket ke andr do chize askti hen true and false
    // basically smjh gy hena

//  if("apple");
// this isnt true neither it is false yet still code will run this is because of truthy and falsy

// loops
// for while
// repeat

// 1 12 123 triangle
for (let i = 1; i <= 5; i++) {
    // isme cout ni hota console log hamesha change krdega like newline
var num = 1;
let row = ""
    for(let j = 1; j <= i; j++)
    {
        row += num
        num++
    }
    console.log(row);
}
for (let i = 1; i <=10; i++)
{
    console.log(i);
}
// while loop

let n = 1
while(n<11)
{
    console.log("Hello World" + ' '+ n);
    n++;
}
// time taken to count  10K

const timestart = Date.now();
for(let count = 1; count <= 10; count++)
{
    if (count == 10)
    {
        console.log("Hello");
    }
}
const endtime = Date.now();
const timetaken = (endtime - timestart) / 1000;
console.log(timetaken);


// functions 

// reusabilty same shi bhai 

function hello(n)
{
    for (let i = 0; i < n; i++)
    console.log("Hello world");
}
// function upr bnao jidhr bhi bnao jahan bhi call kroge hjojayega
hello(4);
// arguments = real value jo hamd ete henn functions chalate wqt
// paramters same shi yrrrrr 

// Arrays

// aik se ziyada value in a single variable same shi

let array = [12,13,14, "Muzammil"];
for (let index = 0; index < array.length; index++) {
    console.log(array[index]);
    
}

// we can also make -ve indexes in js arrays


//psuh pop shift unshift

// push = extra member add at last

// pop last member remove

// unshift shuru me aik value jota he

// shift shuru ki value hatadeta he

// splice se bech me se khin se bhi hata do

let arr = [1,233,22,221,11];
console.log(arr);
arr.pop();
console.log(arr);
arr.push(99);
console.log(arr);
arr.shift();
console.log(arr);
arr.unshift(77);
console.log(arr);
// kahan se kahan tk remove krna he as in from which index to which one
// pehla is index no then dusra is uske bad kitni hatani he agr i likhen ge to start +i tk hateyaga smjhe dhakan
arr.splice(2,1);
console.log(arr);



// one or more talk about person then array. talk all and everything about a person then object

// object is to hold details of one individual in a key value pair


// 1 blank object
var a = {};
// {} are object and blank is blank object
// 2 filled obj
var me = {
    age: 18,
    name: "Muzammil",
    phoneno: "03402211076",
    linkedIN: "Muzammil Alam", 
    kuchbolo: function(Number){
        for(let i = 0; i < Number; i++)
        console.log("Hello");
    }
}
console.log(me);
// how to access that thing
console.log(me.age);
console.log(me.name);
console.log(me.phoneno);
console.log(me.linkedIN);

// these are basically property
// methos = wo property jo function he
console.log(me.kuchbolo(4));



// var let const
// es5 es6 are two vers of js es5 is old and is6 is new
// es5 had only var and es6 had let and const

// var function scoped hota hai in js

//var can be used anywehre in the parent function

function hello4(){
    for(var i = 1; i <13; i++){
        console.log(i);
    }
    console.log(i);
}
hello4();
hello2();
// because of this 12 wwill also be printed to counter this 
// we use let and const and let const is only braces scoped

function hello2(){
    for(let j = 17; j < 20; j++){
        console.log(j);
    }
    // console.log(j); this rn will give error as j is not not defined

}


// kch cheen js me ni hen lkn ham browser ki madad se unhen use kr skte
// hen aisii sri chizen jho ham use kr skte hen aik particular object main jiska nam hai window

// like alert prompt console and so many more are borrowed by the browser
// document fetch localStorage 
// cntrl shft j and search for window

//  var adds itself into the window object 
// let const doesn't adds

// ading var in window is not good as it exposed varaible data

//browser conte4xt apu has window stack and heap  memory

// STACK

// jis order me memory add hoti he usi order me delete / remove hoit he

// Heap memory
// the data neads to be stored somewhere this need to be stored somewhere and this is placed in heap memory
// 2+3+4+4 2+3 store krega phir 5 ko khin store karega pehle bech ka intermediate data ko store krta he wo heap memory me store hota he


// execution  context
// it simply mean s whenever we''ll run a function func creates and imaginary container which will have it's three things
// 1- varaibles
// 2- inner functionss insider thatr parent func
// 3- lexical environment of that function
// this imaginary container is execution context

// lexical envi basivccally tells which things we can access and which not

function lexo(){
    var ae = 12;
    function def(){
        var be = 12;
    }
    // like we will not be able to access the be variable we cannot use the be function and this is lexical environment which tells we cannot use it
    // var only is scopwe till nearest parent function
    // lexical environments tells us what things our function can access and which not

}

// execution context is a container where the functions code is executed and it s always created wheeveer a function is called
// it contains 3 things variables functions and lexical envitro of that functio

// lexical enviro hota hai ek chart jisme ye likha hota he apka particular function kin chizo ko access krt skta he and kinko nahi
// basically khudka scope and and the scope chain sabse andr wala function like the youngest child will be able to acess the variables of the oldest parent


// how to copy reference values 

var au = [1,32,3,5,3];
var bu = [...au];
// these 3 dots means they are spread operator this means copying the values in that ok
console.log(au);
console.log(bu);
bu.pop();

console.log(bu);
au.push(55);
console.log(au);

// we can do something same with objects as well.
var obj1 =  {name: "Muzammil Alam"};
var copyobj1 = {...obj1};

console.log(obj1.name);
console.log(copyobj1.name);
// this is real copy

// truthy and falsy
// in js whatvr we write in it that is basically one way or two something those two particular ways are truthy and falsy

 // falsy = 0 false undefined null NaN document.all
// rest all becomes truthy only the above one will become falsy

if(1){
    console.log("Truthy");
}
else{
    console.log("Falsy");
}
if(NaN){
    console.log("Truthy");
}
else{
    console.log("Falsy");
}

// Switch cases

// simple

// for each for in do-while

// for each only works on array
// whvr we have array then for each becomes in use
// 
var each = [1,2,3,4,5,6,7,8,9];

each.forEach(function(val /* this val can be anyname*/){
    console.log(val+2);
    // val is simply a variable
    // whis will add 2 to each element of the array
    // smjhe for each khud hi bta rha he for each element
    // the function used here is anonymous function
    // main array me changes ni krega by default wo changes krke deta heimaginary / temporary copty pr array ki jiski wja se array always remains the same
    // even if we do val+2; then still no copy thinngi
})

// For in loop
// objects par loop krne ke liye hota he for in loop
 
var object = {
    name: "Muzammil Alam",
    age: 18,
    city: "Karachi"
}
for (var key in object){
    // key will hold the variables basically
    console.log(key + ':', object[key]);

    // key is basically the name of the variable and the key will be converted to that particular variable this would basivcally meains object.key
}

// do while loop

// same c++ logic
var g = 10;
do {
    console.log(g);
    g++;
} while (a < 15);



// Call back function

// let's say a button get a photo upon clicking this buitton a request oto facebook would be send to get the photo 
// we donbt know the exact time that this photo will get to us
// aisa code jo khin p rjakr kch krega thirdparty pr jakr kch lekr ayega
// we dont know when this will come
// and since we dont know whnen it will work then this function is of callback function

setTimeout(function helo(){
    console.log("2 Second baad chala");
    // this is asynchronus js
    // js bolti tm side hojao jab complete hojaye phir ana
    // this whole function is call back function 
    // cal back function tab chlta he jab kam complete hojaye

    // ye function tab chalega jab time hojayega isko dekhona tmne khin call ni kiya or na hi koi nam edia he
    // this function cannoot be used anywhere else

}, 2000)
// 2000 ms

// helo(); this will not work here


// first class functions 

// a concept where a function can be used as a value

// a function can be stored in a variable like a value

function firstclass(a){

    a();
}

firstclass(function(){
    console.log("hello");
})

// how are arrays made behind the screen

var arryy = [1,2,3,4,5];

// this is basically an object array is not really an array in js

// js converets it to
// this is why we can put -ve inedex in array as it really is not an array
arr = {
    0:1,
    1:2,
    2:3,
    3:4,
    4:5
}
// it will be converted to this
// [] {} both are objects but

// .isArray is used to finnd if it is an array or not

// delete object
var delete1 = {
    name: "Delete",
    age:  0,
    kilo: "0kb"
}
console.log(delete1);
delete delete1.age;
console.log(delete1);
console.log(delete1.age);

