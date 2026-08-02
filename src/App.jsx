import { useState } from 'react'
import './App.css'

function getWeatherDescription(code) {
  if (code === 0) {
    return 'Clear sky'
  }

  if (code === 1 || code === 2) {
    return 'Partly cloudy'
  }

  if (code === 3) {
    return 'Overcast'
  }

  if (code === 45 || code === 48) {
    return 'Foggy'
  }

  if (code >= 51 && code <= 57) {
    return 'Drizzle'
  }

  if (code >= 61 && code <= 67) {
    return 'Rainy'
  }

  if (code >= 71 && code <= 77) {
    return 'Snowy'
  }

  if (code >= 80 && code <= 82) {
    return 'Rain showers'
  }

  if (code >= 95) {
    return 'Thunderstorms'
  }

  return 'Unknown conditions'
}

function App() {
  const [city, setCity] = useState('')
  const [searchedCity, setSearchedCity] = useState('')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)

 async function searchCity() {
  const trimmedCity = city.trim()

  if (!trimmedCity) {
    return
  }

  // First request: turn the city name into coordinates.
  const locationUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=en&format=json`

  const locationResponse = await fetch(locationUrl)
  const locationData = await locationResponse.json()

  const matchedLocation = locationData.results?.[0]

  // Stop if the city could not be found.
  if (!matchedLocation) {
    setLocation(null)
    setWeather(null)
    return
  }

  setLocation(matchedLocation)
  setSearchedCity(trimmedCity)

  // Second request: use the coordinates to retrieve weather.
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${matchedLocation.latitude}&longitude=${matchedLocation.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`

  const weatherResponse = await fetch(weatherUrl)
  const weatherData = await weatherResponse.json()

  setWeather(weatherData.current)
}

  return (
  <main className="app">
    <section className="weather-panel">
      <header className="app-header">
        <p className="eyebrow">Project Gaia</p>
        <h1>SeasonSense</h1>
        <p className="subtitle">
          Search for a city to view its current weather.
        </p>
      </header>

<form
  className="search-row"
  onSubmit={(event) => {
    event.preventDefault()
    searchCity()
  }}
>
  <input
    type="text"
    placeholder="Enter a city..."
    value={city}
    onChange={(event) => setCity(event.target.value)}
  />

  <button type="submit">
    Search
  </button>
</form>

      {location && (
        <section className="location-card">
          <p className="card-label">Current location</p>
          <h2>{location.name}</h2>
          <p>
            {location.admin1}, {location.country}
          </p>
        </section>
      )}

      {weather && (
        <section className="weather-card">
          <div className="weather-summary">
            <div>
              <p className="card-label">Current weather</p>
              <h2>{getWeatherDescription(weather.weather_code)}</h2>
            </div>

            <p className="temperature">
              {weather.temperature_2m}°F
            </p>
          </div>

          <div className="weather-grid">
            <article>
              <p>Feels like</p>
              <strong>{weather.apparent_temperature}°F</strong>
            </article>

            <article>
              <p>Humidity</p>
              <strong>{weather.relative_humidity_2m}%</strong>
            </article>

            <article>
              <p>Wind</p>
              <strong>{weather.wind_speed_10m} mph</strong>
            </article>
          </div>
        </section>
      )}
    </section>
  </main>
)
}

export default App
