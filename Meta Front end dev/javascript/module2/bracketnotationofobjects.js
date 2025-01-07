
let change = ["room", "area", "name", "food","options"]

let house = {


    room: 5,
    area: "Saddar",
    name: "Miraal",
    food: true,
    options: ["Karahi gosht", "Mutton butt", "Kalegi boti" ]
    
};

// house["room"] = 4;
// house["area"] = "Saddar"
// house["name"] = "Miraal"
// house["food"] = true

console.log(house);

// this way is known as racket notation

// Finally, there's one really useful thing that bracket notation has but is not available in the dot notation: It can evaluate expressions.


// you can look see

// house["options"] = ["Karahi gosht", "Mutton butt", "Kalegi boti"]

console.log(house.options)
console.log(house.options[2])




for (let i = 0; i < change.length; i++){
    console.log(house[change[i]])
// change[i] change[0]= "room" hence house["room"] becomes 5 ir whatever the value is going to be
}

var arrOfKeys = ['speed', 'altitude', 'color'];
var drone = {
    speed: 100,
    altitude: 200,
    color: "red"
}
for (var i = 0; i < arrOfKeys.length; i++) {
    console.log(drone[arrOfKeys[i]])
}