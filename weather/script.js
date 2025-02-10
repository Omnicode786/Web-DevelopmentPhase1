const apiKey = "ca19a1ec3ce04a12aad195830251002";
const apiurl = "https://api.weatherapi.com/v1/current.json?key=" + apiKey + "&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    try {
        const response = await fetch(apiurl + city);

        // Check if the API response is valid
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        // If the API returns an error inside the JSON response
        if (data.error) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        // Display Weather Data
        document.querySelector(".city").innerHTML = data.location.name;
        document.querySelector(".temp").innerHTML = Math.round(data.current.temp_c) + "°C";
        document.querySelector(".humidity").innerHTML = data.current.humidity + "%";
        document.querySelector(".wind").innerHTML = data.current.wind_kph + " km/h"; 

        // Convert the condition to lowercase for better matching
        const condition = data.current.condition.text.toLowerCase();

        // Weather Icon Mapping
        if (condition.includes("cloud")) {
            weatherIcon.src = "img/clouds.png";
        } else if (condition.includes("clear")) {
            weatherIcon.src = "img/clear.png";
        } else if (condition.includes("rain")) {
            weatherIcon.src = "img/rain.png";
        } else if (condition.includes("drizzle")) {
            weatherIcon.src = "img/drizzle.png";
        } else if (condition.includes("mist") || condition.includes("fog")) {
            weatherIcon.src = "img/mist.png";
        } else if (condition.includes("thunder")) {
            weatherIcon.src = "img/thunderstorm.png"; // Make sure this image exists
        } else if (condition.includes("snow")) {
            weatherIcon.src = "img/snow.png"; // Make sure this image exists
        } else if (condition.includes("overcast")) {
            weatherIcon.src = "img/clouds.png";
        } else {
            weatherIcon.src = "img/default.png"; // Default image for unknown conditions
        }

        // Show the weather details and hide the error
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    } catch (error) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

// Event Listener for Search Button
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
