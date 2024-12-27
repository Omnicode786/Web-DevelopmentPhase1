// selection
// css change
// html change
// text change
// adding listeners


// listeners can alos be customized 

// mouse enter and mouseleave are listeners

// Pinterest website script

// there will be an array and obect wil be there and every object will have some data

//image hogi name hoga

let fetchedImages = [
    {
        name: "Muhammad Ali", image: "https://i.pinimg.com/736x/da/f3/81/daf381edda3a89b1de6e7553ea997610.jpg"
    },
    {
        name: "Cash", image: "https://i.pinimg.com/736x/5d/9f/b8/5d9fb8597ffa438bb96e57923fae40f8.jpg"
    },
    {
        name: "Car", image: "https://i.pinimg.com/736x/67/fa/bc/67fabcad5b7fb3a976bf89ecb1212d90.jpg"
    },
    {
        name: "Work Hard", image: "https://i.pinimg.com/736x/44/05/f6/4405f6318a2e7c2b39e63201cb549b58.jpg"
    },
    {
        name: "Chess", image: "https://i.pinimg.com/736x/d1/17/4e/d1174e3b2cca034ebe29fee334443354.jpg"
    },
    {
        name: "NBA", image: "https://i.pinimg.com/736x/14/fd/8b/14fd8bdfd1a0fd75549a4d712299606f.jpg"
    },
    {
        name: "Game", image: "https://i.pinimg.com/736x/83/7a/3f/837a3fb0b4d9cde260f92b2a7cb2474f.jpg"
    },
    {
        name: "Night", image: "https://i.pinimg.com/736x/1c/4c/6a/1c4c6a4c169473ac4331246a70eda622.jpg"
    },
    {
        name: "Maps", image: "https://i.pinimg.com/736x/e9/ca/dc/e9cadc91069c1ad964bf05e2faffcec6.jpg"
    }
];

// Fetch Random Images
async function fetchRandomImages() {
    const fetchPromises = Array.from({ length: 500 }, async (_, i) => {
        const response = `https://picsum.photos/200/150?random=${Math.random()*55}`;
        return {
            
            name: ` Image${i}`,
            image: response
        };
    });

    // Wait for all fetches to complete
    fetchedImages= (await Promise.all(fetchPromises));
    showCards(fetchedImages);
}

// Display Cards
function showCards(images) {
    let clutter = "";
    images.forEach(function (obj) {
        clutter += `
            <div class="box">
                <img class="cursor-pointer" src="${obj.image}" alt="${obj.name}">
                <div class="caption">${obj.name}</div>
            </div>`;
    });
    document.querySelector(".container").innerHTML = clutter;
}

// Ensure DOM is loaded before fetching images
document.addEventListener("DOMContentLoaded", () => {
    fetchRandomImages();
});
// ${} this is how we add dynamic data


var a = document.querySelector(".overlay");
var b = document.querySelector(".searchdata")
var input = document.querySelector("#searchinput")
function InputFunction(){
    input.addEventListener("focus",function(){
        a.style.display = "block"
    })
    input.addEventListener("blur",function(){
        a.style.display = "none"
    })

input.addEventListener("input",function(){
    // Array Filer()
    const filterarray = fetchedImages.filter(obj => obj.name.toLowerCase().startsWith(input.value));
    var clutter = "";
    filterarray.forEach(function(obj){
        clutter += `<div class="res flex px-8 py-3">
            <i class="ri-search-line font-semibold mr-5"></i>
            <h3 class="font-semibold">${obj.name}</h3>
        </div>`
    })
    b.style.display="block";
    b.innerHTML=clutter;

})
input.addEventListener("blur",function(){
    b.style.display="none";
    
})
}
InputFunction();