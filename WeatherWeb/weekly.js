async function getWeather() {
    const apiKey = "API-Key";
    const city = document.getElementById('searchbar').value;
    if (!city) {
        alert('Please enter a city');
        return;
    }

    const weatherIcons = {
        clearSkyDay: ["01d"],
        fewClouds: ["02d", "02n"],
        clouds: ["03d", "03n", "04d", "04n"],
        rain: ["09d", "09n", "10d", "10n"],
        thunderstorm: ["11d", "11n"],
        snow: ["13d", "13n"],
        mist: ["50d", "50n"],
        clearSkyNight: ["01n"]
    };

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();

        if (data.cod !== "200") {
            alert(data.message);
            return;
        }

        display5DayForecast(data.list, weatherIcons);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function display5DayForecast(forecastData, weatherIcons) {
    const weeklyForecastDiv = document.getElementById('weekly-forecast');
    weeklyForecastDiv.innerHTML = ''; // Clear previous content

    // Group data by day
    const dailyData = {};
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString(); // Group by date
        if (!dailyData[date]) {
            dailyData[date] = [];
        }
        dailyData[date].push(item);
    });

    // Display a summary for each day
    Object.keys(dailyData).slice(0, 5).forEach(date => { // Limit to 5 days
        const dayData = dailyData[date];
        const temperatures = dayData.map(item => item.main.temp - 273.15); // Convert to Celsius
        const avgTemp = Math.round(temperatures.reduce((a, b) => a + b) / temperatures.length);
        const description = dayData[0].weather[0].description;
        const iconCode = dayData[0].weather[0].icon;

        // Bestimme das richtige Icon basierend auf deinem Mapping
        let customIcon = "Pictures/nebel.png"; // Default icon
        if (weatherIcons.clearSkyDay.includes(iconCode)) {
            customIcon = "Pictures/sun.webp";
        } else if (weatherIcons.fewClouds.includes(iconCode)) {
            customIcon = "Pictures/leicht_bewölkt.png";
        } else if (weatherIcons.clouds.includes(iconCode)) {
            customIcon = "Pictures/bewölkt.webp";
        } else if (weatherIcons.rain.includes(iconCode)) {
            customIcon = "Pictures/regen.png";
        } else if (weatherIcons.thunderstorm.includes(iconCode)) {
            customIcon = "Pictures/gewitter.png";
        } else if (weatherIcons.snow.includes(iconCode)) {
            customIcon = "Pictures/schnee.png";
        } else if (weatherIcons.mist.includes(iconCode)) {
            customIcon = "Pictures/nebel.png";
        } else if (weatherIcons.clearSkyNight.includes(iconCode)) {
            customIcon = "Pictures/mond.webp";
        }

        // Erstelle das HTML für den Tagesabschnitt
        const dailyItemHtml = `
            <div class="daily-item">
                <span class="date">${date}</span>
                <img src="${customIcon}" alt="Weather Icon" class="weather-icon">
                <span class="temperature">${avgTemp}°C</span>
                <p class="description">${description}</p>
            </div>
        `;

        weeklyForecastDiv.innerHTML += dailyItemHtml;
    });
}

