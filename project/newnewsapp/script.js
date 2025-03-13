const NEWS_API_KEY = "0abd236991914684ae1b94a869a3e898"; // Your NewsAPI key
const GEMINI_API_KEY = "AIzaSyC1TMNn8H5q8mMUTBMyiZA9uB79f4HEPLI"; // Your Gemini API key

const newsUrl = "https://newsapi.org/v2/everything?q=";
const cardsContainer = document.getElementById("cardscontainer");
const template = document.getElementById("template-new");

// Fetch News
window.addEventListener('load', () => fetchNews("Pakistan"));

async function fetchNews(query) {
    try {
        const response = await fetch(`${newsUrl}${query}&apiKey=${NEWS_API_KEY}`);
        const data = await response.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Render News
function bindData(articles) {
    cardsContainer.innerHTML = "";
    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = template.content.cloneNode(true);
        fillData(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Fill News Data
function fillData(card, article) {
    const newsImg = card.querySelector("#newsImage");
    const newsTitle = card.querySelector("#news-title");
    const newsSource = card.querySelector("#news-source");
    const newsDesc = card.querySelector("#new-desc");
    const summarizeBtn = document.createElement("button");

    newsImg.src = article.urlToImage;
    newsTitle.innerText = article.title;
    newsDesc.innerText = article.description || "Click to read more.";
    newsSource.innerText = `${article.source.name} • ${new Date(article.publishedAt).toLocaleDateString()}`;

    // 🔹 Add Summarize Button
    summarizeBtn.innerText = "Summarize";
    summarizeBtn.classList.add("summarize-btn");
    summarizeBtn.addEventListener("click", () => summarizeNews(article.url, newsDesc));
    card.querySelector(".card-content").appendChild(summarizeBtn);
}

// 🔹 AI Summarization Feature (Using Latest Gemini API)
async function summarizeNews(articleUrl, newsDescElement) {
    try {
        const prompt = `Summarize this news article: ${articleUrl}`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        console.log("API Response:", data); // 🔹 Log response for debugging

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            newsDescElement.innerText = `Error: ${data.error.message}`;
            return;
        }

        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate summary.";
        newsDescElement.innerText = summary;

    } catch (error) {
        console.error("Error summarizing news:", error);
        newsDescElement.innerText = "Failed to summarize news.";
    }
}

// 🔹 Dark Mode Toggle
document.getElementById("dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll(".card").forEach(card => card.classList.toggle("dark"));
});
