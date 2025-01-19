// API-Key zur Authentifizierung bei OpenWeatherMap
const apiKey = "API_key"; 

// Liste der Städte in Deutschland, für die Wetterdaten abgerufen werden sollen
const cities = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Stuttgart", "Düsseldorf", "Dresden", "Erfurt", "Nürnberg", "Hannover", "Rostock"];

// Temperatur in Celsius (Einheit für API-Aufruf)
const units = "metric";

// Icons für verschiedene Wetterzustände
const weatherIcons = {
    clearSkyDay: ["01d"], // Klarer Himmel tagsüber
    fewClouds: ["02d", "02n"], // Leicht bewölkt (tagsüber und nachts)
    clouds: ["03d", "03n", "04d", "04n"], // Bewölkt
    rain: ["09d", "09n", "10d", "10n"], // Regen
    thunderstorm: ["11d", "11n"], // Gewitter
    snow: ["13d", "13n"], // Schnee
    mist: ["50d", "50n"], // Nebel/Dunst
    clearSkyNight: ["01n"] // Klarer Himmel nachts
};

// Funktion zum Setzen des passenden Wetter-Icons für eine Stadt
function setWeatherIcon(city, iconCode) {
    // Holt das Bild-Element für die jeweilige Stadt
    const imageElement = document.getElementById(`${city}Pic`); 
    if (!imageElement) return; // Wenn kein Bild-Element gefunden wird, abbrechen

    // Überprüfung des Wetter-Icon-Codes und Setzen des entsprechenden Icons
    if (weatherIcons.clearSkyDay.includes(iconCode)) {
        imageElement.src = "Pictures/sun.webp"; // Klarer Himmel tagsüber
    } else if (weatherIcons.fewClouds.includes(iconCode)) {
        imageElement.src = "Pictures/leicht_bewölkt.png"; // Leicht bewölkt
    } else if (weatherIcons.clouds.includes(iconCode)) {
        imageElement.src = "Pictures/bewölkt.webp"; // Bewölkt
    } else if (weatherIcons.rain.includes(iconCode)) {
        imageElement.src = "Pictures/regen.png"; // Regen
    } else if (weatherIcons.thunderstorm.includes(iconCode)) {
        imageElement.src = "Pictures/gewitter.png"; // Gewitter
    } else if (weatherIcons.snow.includes(iconCode)) {
        imageElement.src = "Pictures/schnee.png"; // Schnee
    } else if (weatherIcons.mist.includes(iconCode)) {
        imageElement.src = "Pictures/nebel.png"; // Nebel
    } else if (weatherIcons.clearSkyNight.includes(iconCode)) {
        imageElement.src = "Pictures/mond.webp"; // Klarer Himmel nachts
    } else {
        imageElement.src = "Pictures/nebel.png"; // Standard-Icon für unbekannte Bedingungen
    }
}

// Wetterdaten für jede Stadt abrufen und die HTML-Elemente aktualisieren
cities.forEach(city => {
    // Erstelle die API-URL für den Abruf von Wetterdaten
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=de&appid=${apiKey}`;
    
    // Abruf der Daten über die Fetch-API
    fetch(apiUrl)
        .then(response => {
            // Überprüfung, ob die Antwort erfolgreich ist
            if (!response.ok) {
                throw new Error(`Fehler beim Laden der Wetterdaten für ${city}: ${response.status}`);
            }
            return response.json(); // Konvertiere die Antwort in ein JSON-Objekt
        })
        .then(data => {
            // Sicherstellen, dass Wetterdaten vorhanden sind
            if (!data.weather || data.weather.length === 0) {
                throw new Error(`Keine Wetterdaten für ${city} verfügbar.`);
            }

            // Wetterdetails aus der API-Antwort extrahieren
            const temperature = data.main.temp; // Temperatur in Celsius
            const iconCode = data.weather[0].icon; // Icon-Code des Wetters
            const description = data.weather[0].description; // Beschreibung des Wetters

            // Holt das Stadt-Element und aktualisiert die Anzeige
            const cityElement = document.getElementById(city);
            if (cityElement) {
                cityElement.innerHTML = `
                    ${city}: ${temperature}°C
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" title="${description}">
                `;
            }

            // Setze das Wetter-Icon in der Karte
            setWeatherIcon(city, iconCode);
        })
        .catch(error => {
            // Fehler beim Abruf oder Verarbeiten der Daten
            console.error(`Fehler bei der Verarbeitung der Daten für ${city}:`, error);

            // Falls ein Fehler auftritt, zeige eine entsprechende Nachricht
            const cityElement = document.getElementById(city);
            if (cityElement) {
                cityElement.innerHTML = `${city}: Daten nicht verfügbar`;
            }
        });
});

