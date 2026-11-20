
// 1. Load JSON data
let travelData = null;
fetch("./travel_recommendation_api.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load JSON file");
        }

        return response.json();
    })
    .then(data => {
        travelData = data;
        console.log("Travel data loaded:", travelData);
    })
    .catch(error => {
        console.error("Error loading data:", error);
    });


// 2. Get HTML elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsContainer = document.getElementById("results");
const heroSection = document.getElementById("hero");
const resultsSection = document.getElementById("results-section");

// 3. Normalize search keywords
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

// 4. Search recommendations
function searchRecommendations() {
    if (!travelData) {
        alert("Travel data is still loading. Please try again.");
        return;
    }
    const keyword = normalizeText(searchInput.value);
    
    // Identify the search category

    let recommendations = [];

    if (["playa", "playas", "beach", "beaches"].includes(keyword)) {

        recommendations = travelData.beaches;

    } else if (["templo", "templos", "temple", "temples"].includes(keyword)) {

        recommendations = travelData.temples;

    } else if (["pais", "paises", "country", "countries"].includes(keyword)) {

        recommendations = travelData.countries.flatMap(country => country.cities);

    } else {

        alert("Please search for beaches, temples or countries.");
        return;
    }

    // Display recommendations
    displayResults(recommendations);
}


// 5. Display recommendations
function displayResults(recommendations) {

    // Hide the homepage introduction
    heroSection.style.display = "none";

    // Show search results section
    resultsSection.style.display = "block";

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Display recommendations
    recommendations.forEach(place => {

        const card = document.createElement("div");
        card.classList.add("result-card");

        const image = document.createElement("img");
        image.src = place.imageUrl;
        image.alt = place.name;

        const title = document.createElement("h3");
        title.textContent = place.name;

        const description = document.createElement("p");
        description.textContent = place.description;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(description);

        resultsContainer.appendChild(card);
    });
}

// 6. Clear search results
function clearResults() {
    // Clear search input
    searchInput.value = "";
    // Remove search results
    resultsContainer.innerHTML = "";
    // Hide results section
    resultsSection.style.display = "none";
    // Show homepage introduction again
    heroSection.style.display = "flex";
}

// 7. Button events
searchBtn.addEventListener("click", searchRecommendations);
clearBtn.addEventListener("click", clearResults);