// JavaScript has handy built-in objects. One of these popular built-in objects is the Math object.


// Maths constantws


let PI = Math.PI
let E = Math.E
let LN2 = Math.LN2


console.log(PI)
console.log(E)
console.log(LN2)


// Rounding methods
// These include: 

//  Math.ceil() - rounds up to the closest integer 

//  Math.floor() - rounds down to the closest integer 

//  Math.round() - rounds up to the closest integer if the decimal is .5 or above; otherwise, rounds down to the closest integer 

//  Math.trunc() - trims the decimal, leaving only the integer
console.log(Math.ceil(PI))
console.log(Math.floor(E))
console.log(Math.round(LN2))
console.log(Math.trunc(LN2))

// random method
// random function creattes betwn 0 and 0.99

let decimal = Math.random()*(Math.random()*20)
console.log(Math.ceil(decimal))