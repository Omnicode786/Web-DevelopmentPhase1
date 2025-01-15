function addtaxestoprices(taxrate, ...itemsbaught){
    return itemsbaught.map(item => taxrate*item)
}

let shoopping = addtaxestoprices(1.1,1.6, 22, 44, 634, 2342);
console.log(shoopping)

let veggies = ['onion', 'parsley'];
veggies = [...veggies, 'carrot', 'beetroot']; // ['onion', 'parsley', 'carrot', 'beetroot']

//The spread operator creates a shallow copy, meaning it does not copy nested objects or arrays deeply.
// rest paraemrer should alwasy be passsed in the last of hte function


const meal = ["soup", "steak", "ice cream"]
let [starter] = meal;
let [starter1] = meal;

console.log(starter);
// accesses first one only first

let obj = {
    key: 1,
    value: 4
};

let output = { ...obj };
output.value -= obj.key;

console.log(output.value);
