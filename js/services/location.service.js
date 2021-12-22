export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    setLocGeoName,
    getWeather
}

import { utils } from '../utils.js'

const WEATHER_API_KEY = 'fd23a7ed425718a8f157d79ae6a243fa';

const locs = [
    createLoc('Great place', 32.047104, 34.832384),
    createLoc('Never again', 32.047201, 34.832581)
]

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs);
    })
}

function createLoc(name, lat, lng) {
    return {
        id: utils.getRandomId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function addLoc(name, lat, lng) {
    const loc = createLoc(name, lat, lng)
    locs.push(loc);
    return loc.id;
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId);
    locs.splice(locIdx, 1);
    console.log(locs);
}

function setLocGeoName(locId, geoName) {
    const loc = locs.find(loc => loc.id === locId)
    loc.geoName = geoName
}

getWeather(32.047104, 34.832384)

function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
    return axios.get(url)
        .then(ans => {
            console.log(ans.data)
            const elWeatherInfo = document.querySelector('.weather-info');

            const weatherImg = "http://openweathermap.org/img/wn/" + ans.data.weather[0].icon + "@2x.png"; // img
            const locName = ans.data.name // Tel Litwinsky
            const country = ans.data.sys.country // IL
            const weatherDescription = ans.data.weather[0].description // broken clouds
            const tempNow = ans.data.main.temp + '°C' // 12.4 (temperature now)
            const tempMin = ans.data.main.temp_min // 11.66 (temperature min)
            const tempMax = ans.data.main.temp_max + '°C' // 14.15 (temperature max)
            const wind = ans.data.wind.speed // 1.54 (wind m/s)
        })
}