

let AllCards = [];
let sum = AllCards.reduce((acc, num) => acc + num, 0);
let hasBlackJack = false
let isAlive = true
let message = ""
var display = document.querySelector("#message-el");
var sumer = document.querySelector("#sum-el")
var cards = document.querySelector("#cardsEl")
function startGame() {
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "Wohoo! You've got Blackjack!"
        hasBlackJack = true
    } else {
        message = "You're out of the game!"
        isAlive = false
    }
    updatedisplay();

}
function updatedisplay(){
    display.textContent = message
    sumer.textContent = `Sum: ${sum}`
   cards.textContent = "Cards: " + AllCards.join(" ")
}

function newCard(){
    let newcard = Math.floor((Math.random()*21) + 1)
    sum += newcard;
    AllCards.push(newcard);
    startGame();
}
