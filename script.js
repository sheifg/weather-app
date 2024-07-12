const apiKey = "õ·éÏ]{Î<ÕÞ¼÷ÇÜÑßÝ¦õ×Íu";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";
let cities = [];

const form = document.getElementById("form");

const bringFromStorage = function () {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
};

function getApiUrl(city) {
  const url = BASE_URL + `q=${city}&appid=${btoa(apiKey)}&units=metric`;
  return url;
}

async function getCityDataFromApi(cityName) {
  const url = getApiUrl(cityName);
  const res = await axios.get(url);
  const data = res.data;
  return data;
}

function parseCityDataFromApi(cityDataFromApi) {
  console.log(cityDataFromApi);
  const cityData = {
    id: cityDataFromApi.id,
    name: cityDataFromApi.name,
    country: cityDataFromApi.sys.country,
    temp: cityDataFromApi.main.temp,
    icon: cityDataFromApi.weather[0].icon,
    description: cityDataFromApi.weather[0].description,
    time: cityDataFromApi.dt
  };
  return cityData;
}

function calculateLastUpdateTime(time) {
  // Convert to milliseconds
  const date = new Date(time * 1000);
  // Our time now
  const now = new Date();
  return Math.round((now - date) / 1000 / 60);
}

function displayCityCard(cityData) {
  let difference = calculateLastUpdateTime(cityData.time);
  console.log(cityData.time);
  const html = `   
    <div class="col" data-id=${cityData.id}>
        <div class="city">
        <h2 class="city_name">
            <span>${cityData.name}</span><span class="country_code">${cityData.country}</span>
            <i class="bi bi-x-circle-fill close-icon text-danger"></i>
        </h2>
        <div class="city_temp">${cityData.temp}<sup>°C</sup></div>
        <figure>
            <img
            src="https://openweathermap.org/img/wn/${cityData.icon}@2x.png"
            alt="icon"
            class="city-icon"
            />
        </figure>
        <figcaption>${cityData.description}</figcaption>
        <div class="card-footer">
            <small class="text-body-secondary"
            >last updated ${difference} min ago</small
            >
        </div>
        </div>
    </div>`;
  document.querySelector(".cities").innerHTML += html;
}

function initializeApp() {
  bringFromStorage();
  cities.forEach((city) => {
    displayCityCard(city);
  });
}

function displayError(message) {
  const error = document.querySelector(".error_message");
  error.textContent = message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  displayError("");
  const inputValue = form.querySelector(".header_input").value;
  if (
    cities.find((city) => inputValue.toLowerCase() === city.name.toLowerCase())
  ) {
    displayError(
      `${inputValue} is already included. Please enter another city.`
    );
  } else {
    const cityDataFromApi = await getCityDataFromApi(inputValue);
    const cityData = parseCityDataFromApi(cityDataFromApi);
    displayCityCard(cityData);
    cities.push(cityData);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
  form.reset();
});

document.querySelector(".cities").addEventListener("click", (event) => {
  if (event.target.classList.contains("close-icon")) {
    const card = event.target.closest(".col"); 
    const cityId = Number(card.dataset.id); 
    cities = cities.filter((city) => cityId !== city.id);
    card.remove();
    console.log(cities);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
});

setInterval(() => {
  // Clear the cities container
  const citiesContainer = document.querySelector(".cities");
  citiesContainer.innerHTML = "";
  // Loop over the values of the cities object which has the cities data and render them again
  cities.forEach((city) => {
    displayCityCard(city);
  });
}, 10000);

window.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
