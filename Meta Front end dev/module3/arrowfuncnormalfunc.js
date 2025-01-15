function Traditional() {
    this.name = "Traditional Function";
    setTimeout(function() {
        console.log(this.name); // Undefined, because `this` points to the global object
    }, 1000);
}

function Arrow() {
    this.name = "Arrow Function";
    setTimeout(() => {
        console.log(this.name); // "Arrow Function", because `this` is inherited
    }, 1000);
}

new Traditional();
new Arrow();

//Arrow functions do not have their own this or arguments object.