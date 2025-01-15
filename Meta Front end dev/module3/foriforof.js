const car = {
    engine: true,
    steering: true,
    speed: "slow"
}

const sportscar = Object.create(car)
sportscar.speed = "fast"
console.log("The object is: ", sportscar)

console.log("The for inloop is unreliable")
// because their iterate over prototype as well

for (prop in sportscar){
    console.log(prop)
}
console.log("for of loop is reliable")
for (prop of Object.keys(sportscar)){
    console.log(prop + ": " + sportscar[prop])
    // only the object own properties
}