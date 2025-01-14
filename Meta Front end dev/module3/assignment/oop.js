// polymorphism


var bicycle  = {
    bell: function(){
        return "Watch out!!!"
    }
}
var door = {
    bell:function(){
        return "Hello How are you!!"
    }
}
console.log(bicycle.bell())

console.log(door.bell())


function ringthebell(thing){
    // the ting in the parameter is going to be the object

    console.log(thing.bell())
}
ringthebell(bicycle)
ringthebell(door)

class Bird {
    useWings() {
        console.log("Flying!")
    }
}
class Eagle extends Bird {
    useWings() {
        super.useWings()
        // this will use the useWings function that is in the parents basically inheritance
        console.log("Barely flapping!")
    }
}
class Penguin extends Bird {
    useWings() {
        console.log("Diving!")
    }
}
var baldEagle = new Eagle();
var kingPenguin = new Penguin();
baldEagle.useWings(); // "Flying! Barely flapping!"
kingPenguin.useWings(); // "Diving!"

new Date();
new Error();
new Map();
new Promise();
new Set();
new WeakSet();
new WeakMap();