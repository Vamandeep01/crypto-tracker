const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
const params = "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1";

const listContainer = document.getElementById("list-container");
const comparisonContainer = document.getElementById("comparison-container");
let selectedCryptos = JSON.parse(localStorage.getItem("selectedCryptos")) || [];

// Fetch and display cryptocurrency data
async function fetchCryptos() {
    try {
        const response = await fetch(apiUrl + params);
        const data = await response.json();
        displayCryptos(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayCryptos(data) {
    listContainer.innerHTML = "";
    data.forEach(crypto => {
        const card = document.createElement("div");
        card.className = "crypto-card";
        card.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price}</p>
            <p>24h Change: ${crypto.price_change_percentage_24h}%</p>
            <p>Market Cap: $${crypto.market_cap}</p>
            <button onclick="addToComparison('${crypto.id}')">Compare</button>
        `;
        listContainer.appendChild(card);
    });
}

// Add cryptocurrency to comparison section
function addToComparison(id) {
    if (selectedCryptos.length >= 5) {
        alert("You can only compare up to 5 cryptocurrencies.");
        return;
    }
    if (!selectedCryptos.includes(id)) {
        selectedCryptos.push(id);
        localStorage.setItem("selectedCryptos", JSON.stringify(selectedCryptos));
        displayComparison();
    }
}

// Display comparison section
function displayComparison() {
    comparisonContainer.innerHTML = "";
    selectedCryptos.forEach(async (id) => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}`);
        const data = await response.json();
        const crypto = data[0];
        const card = document.createElement("div");
        card.className = "comparison-card";
        card.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>Price: $${crypto.current_price}</p>
        `;
        comparisonContainer.appendChild(card);
    });
}

// Clear preferences and comparison section
document.getElementById("clear-preferences").addEventListener("click", () => {
    selectedCryptos = [];
    localStorage.removeItem("selectedCryptos");
    displayComparison();
});

// Initialize
fetchCryptos();
displayComparison();
