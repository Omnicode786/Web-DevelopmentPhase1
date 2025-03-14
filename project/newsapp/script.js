const APIKEY = "0abd236991914684ae1b94a869a3e898"
const GEMINI_API_KEY = "AIzaSyC1TMNn8H5q8mMUTBMyiZA9uB79f4HEPLI"; 

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
let modal = false;
 
function fillData(cardClone, article){
    const newsImg = cardClone.querySelector("#newsImage");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newdesc = cardClone.querySelector("#new-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newdesc.innerHTML = article.description;
    cardClone.firstElementChild.dataset.url = article.url; 
    const date = new Date(article.publishedAt).toLocaleDateString("en-US", 
        {timeZone: "Asia/Jakarta"});
    newsSource.innerHTML = `${article.source.name} . ${date}`;
cardClone.firstElementChild.addEventListener('click', () =>{
    if (!modal) window.open(article.url, "_blank");
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


const summarizeBtn = document.getElementById('summarize-button');
const summaryModal = document.getElementById('summary-modal');
const summaryText = document.getElementById('summary-text');
const closeModal = document.querySelector('.close-btn');

let waitingForSelection = false;

summarizeBtn.addEventListener('click', () => {
    waitingForSelection = true;
    modal = true;
    alert("Click on a news card to summarize it!");
});

document.getElementById("cardscontainer").addEventListener('click', async (event) => {
    if (!waitingForSelection) return;

    const card = event.target.closest(".card");
    if (!card) return;

    waitingForSelection = false;

    const articleUrl = card.dataset.url;
    summaryModal.style.display = "block";
    setTimeout(() => {
        summaryModal.classList.add("active");
    }, 10);

    try {
        summaryText.innerText = "Summarizing...";
        const summary = await summarizeNews(articleUrl);
        console.log(summary);
        summaryText.innerText = summary;
    } catch (error) {
        summaryText.innerText = "Failed to summarize.";
    }
});

closeModal.addEventListener('click', () => {
    modal = false;
    setTimeout(() => {
        summaryModal.style.display = "none";
        summaryModal.classList.remove("active");
    }, 300);
});

async function summarizeNews(articleUrl) {
    try {
        const prompt = `Summarize this news article: ${articleUrl}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate summary.";;
    } catch (error) {
        return "Error fetching summary.";
    }
}

