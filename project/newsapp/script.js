const APIKEY = "0abd236991914684ae1b94a869a3e898"


const url = "https://newsapi.org/v2/everything?q="


window.addEventListener('load', () => fetchNews("Pakistan"));


async function fetchNews(query) {
    const response = await fetch(`${url}${query}&apiKey=${APIKEY}`);
    const data = await  response.json();
    bindData(data.articles)
}

function bindData(articles) {
    const cardContainer = document.getElementById("cardscontainer");
    const newCardTemplate = document.getElementById("template-new");
    cardContainer.innerHTML = '';
    articles.forEach((article) => {
        if(!article.urlToImage) return;
        const cardClone = newCardTemplate.content.cloneNode(true);
        fillData(cardClone, article)
        cardContainer.appendChild(cardClone);
        
    });

}

function fillData(cardClone, article){
    const newsImg = cardClone.querySelector("#newsImage");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newdesc = cardClone.querySelector("#new-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newdesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US", 
        {timeZone: "Asia/Jakarta"});
    newsSource.innerHTML = `${article.source.name} . ${date}`;
cardClone.firstElementChild.addEventListener('click', () =>{
    window.open(article.url, "_blank");
})
}


let curselectnav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curselectnav?.classList.remove('active');
    curselectnav = navItem;
    curselectnav.classList.add('active')
}


const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('searchplace');
searchButton.addEventListener('click', () =>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    curselectnav?.classList.remove('active');
    curselectnav = null;

})


let bodyclass = null;
let cardclass = null;
let click = false
const carder = document.querySelector(".card");
 const body = document.querySelector("body");
const night = document.getElementById('dark-mode');
night.addEventListener('click', () => {
    document.body.classList.toggle('active'); // Toggle dark mode for body

    // Select all cards and toggle dark mode
    document.querySelectorAll(".card").forEach(card => {
        card.classList.toggle('dark');
    });

    click = !click;
    night.src = click ? "light.png" : "night.png";
})