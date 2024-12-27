// show real products
// show rea popula rproducts

// on click of produc t add button add it to the card
var Cart = [];
var products = [
    {name: "White Chair", headline: "Soft like cloud", price: "15,000", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Yellow Chair", headline: "Soft like the sun", price: "10,000", image: "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Luxury Chair", headline: "Great for office work", price: "20,000", image: "https://images.unsplash.com/photo-1541533260371-b8fc9b596d84?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "Pink Chair", headline: "Ladies attention", price: "24,000", image: "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}


];

var popular = [
    {name: "Luxury Chair", headline: "Great for office work", price: "20,000", image: "https://images.unsplash.com/photo-1541533260371-b8fc9b596d84?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    {name: "White Chair", headline: "Soft like cloud", price: "15,000", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}

];
function addProd(){
    var clutter = "";
products.forEach(function(product){
    clutter += `  <div class="product w-fit rounded-xl p-2 bg-white">
                <div class="image w-[14rem] h-[13rem] bg-zinc-200 rounded-xl overflow-hidden">
                <img class "w-full h-full object-scale-down" src = "${product.image}" />
                </div>
                <div class="data w-full px-2 py-5">
                    <h1 class="font-semibold text-xl leading-none tracking-tight">${product.name}</h1>
                    <div class="flex justify-between w-full items-center mt-2">
                        <div class="w-1/2">
                            <h3 class="font-semibold opacity-20">${product.headline}.</h3>
                            <h4 class="font-semibold mt-2">RS ${product.price}</h4>
                        </div>
                        <button class=" buttons w-10 h-10 rounded-full shader text-yellow-400"><i
                                class="ri-add-line"></i></button>
                    </div>
                </div>
            </div>`;
})

var add = document.querySelector(".products")
add.innerHTML = clutter;
}
function addPopular(){
    var clutter = "";
    popular.forEach(function(populars){
        clutter += `   <div class="popular bg-white p-2 rounded-2xl flex items-start gap-3 w-[60%] flex-shrink-0">
                    <div class="w-20 h-20 bg-red-500 flex-shrink-0 rounded-2xl border-4 border-white overflow-hidden">
                        <img class="w-full h-full object-cover"
                            src="${populars.image}"
                            alt="">
                    </div>
                    <div class="data py-2 w-full">
                        <h1 class="leading-none font-semibold">${populars.name}</h1>
                        <h4 class="leading-none mt-2 text-sm font-semibold opacity-20">${populars.hea}</h4>
                        <h4 class="mt-3 font-semibold text-zinc-500">${populars.price}</h4>
                    </div>
                </div>`
    })
    var popu = document.querySelector(".populars");
    popu.innerHTML = clutter;
}
function addCart(){
    // note that how you did this is wrong just slector will select only the first parent child for this youneed to do All
    // var button  = document.querySelector(".buttons");
    var button  = document.querySelectorAll(".buttons");

    button.forEach(function(btn){
        btn.addEventListener("click", function(){
            alert("Added to cart!")
        })
    })
}

addProd();
addCart();
addPopular();