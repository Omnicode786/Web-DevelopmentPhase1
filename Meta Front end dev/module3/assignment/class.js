class Car {
    constructor (color, speed){
        this.color = color;
        this.speed = speed;
    }
    turboon(){
        console.log("Turbo mode is on:..");
        // you can us functions in classes without using the function keyword
    }
}

let car1 = new Car("red", 92);
console.log(car1.color,car1.speed);
car1.turboon();


class Animal {
    constructor(){
        this.animal = true;
        console.log("I am an animal");
    }
}

class Bird extends Animal {
    constructor(){
        super();  // Call the parent class constructor
        this.bird = true;
        console.log("I am an animal which is ", this.animal, " and I am also a bird which is ", this.bird);
    }
}

class Eagle extends Bird {
    constructor(){
        super();  // Call the parent class constructor
        this.eagle = true;
        console.log("I am an animal which is ", this.animal, " and I am also a bird which is ", this.bird, " and I am also an eagle which is ", this.eagle);
    }
}

var eagles = new Eagle();
eagles.eagle = false;
console.log(eagles.super())
