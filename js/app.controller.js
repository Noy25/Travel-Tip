import { locService } from './services/location.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onGoTo = onGoTo;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;
window.onDeleteLoc = onDeleteLoc;
window.onSearch = onSearch;
window.onCopyLink = onCopyLink;
window.renderLocationName = renderLocationName;
window.renderWeather = renderWeather;

let gCurrLatLng = { lat: 32.0749831, lng: 34.9120554 }

function onInit() {
    renderLocs();
    const url = new URL(window.location.href);
    let lat;
    let lng;
    if (url.searchParams.get('lat')) {
        lat = +url.searchParams.get('lat');
        lng = +url.searchParams.get('lng');
        gCurrLatLng.lat = lat;
        gCurrLatLng.lng = lng;
    }
    locService.getWeather(gCurrLatLng.lat, gCurrLatLng.lng)
        .then(renderWeather);
    mapService.initMap(lat, lng)
        .then()
        .catch(() => console.log('Error: cannot init map'));
}

function renderWeather(weather) {
    const elWeather = document.querySelector('.weather');

    const strHTML = `<h2>Weather today</h2>
    <img src="${weather.weatherImg}">
    <h4>${weather.locName}, ${weather.country}, <span>${weather.weatherDescription}</span></h4>
    <h5><span>${weather.tempNow}</span> temperature from ${weather.tempMin} to ${weather.tempMax}, wind ${weather.windSpeed} m/s.</h5>`;

    elWeather.innerHTML = strHTML;
}

function renderLocs() {
    locService.getLocs()
        .then(locs => {
            const locsHTMLs = locs.map(loc => `
            <div class="location-line flex justify-between">
                <p>${loc.name}</p>
                <div>
                    <button class="loc-btn fas fa-location-arrow" onclick="onGoTo('${loc.id}')"></button>
                    <button class="loc-btn fas fa-trash" onclick="onDeleteLoc('${loc.id}')"></button>
                </div>
            </div>`)
            document.querySelector('.locs-table tbody').innerHTML = locsHTMLs.join('');
        })
}

function renderLocationName(geoLocName, locName) {
    const elLocationName = document.querySelector('.curr-location');
    elLocationName.innerText = (locName) ? `${locName} (${geoLocName})` : geoLocName;
}

function onCopyLink() {
    const text = `https://noy25.github.io/Travel-Tip/index.html?lat=${gCurrLatLng.lat}&lng=${gCurrLatLng.lng}`
    navigator.clipboard.writeText(text);
}

function onGetUserPos() {
    mapService.getPosition()
        .then(pos => {
            const { latitude, longitude } = pos.coords;
            mapService.panTo(latitude, longitude);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onGoTo(locId) {
    locService.getLocs()
        .then(locs => {
            const locSelected = locs.find(loc => locId === loc.id)
            const { lat, lng, name, geoName } = locSelected
            mapService.panTo(lat, lng);
            renderLocationName(geoName, name);
            locService.getWeather(lat, lng)
                .then(renderWeather)
        })
}

function onDeleteLoc(locId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#21379b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                    .then(() => {
                        locService.deleteLoc(locId);
                        mapService.deleteMarker(locId);
                        renderLocs();
                    })
            }
        })
}

function onAddLoc(mapEv) {
    const { lat, lng } = mapEv.latLng.toJSON();

    Swal.fire({
        input: 'text',
        inputLabel: 'Enter location name :',
        inputPlaceholder: 'e.g. "Puki\'s House"'
    })
        .then((res) => {
            if (res.isConfirmed && res.value.length > 0) {
                const locName = res.value
                gCurrLatLng = { lat, lng };
                mapService.getGeoLoc(undefined, lat, lng)
                    .then(geoLoc => {
                        const locId = locService.addLoc(locName, geoLoc.geoName, geoLoc.lat, geoLoc.lng);
                        mapService.addMarker(locId);
                        renderLocationName(geoLoc.geoName, locName);
                        renderLocs();
                        locService.getWeather(lat, lng)
                            .then(renderWeather);
                    })
            }
        })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onSearch(ev) {
    ev.preventDefault();
    const elInputSearch = document.querySelector('input[type="search"]');
    if (!elInputSearch.value) return;

    Swal.fire({
        input: 'text',
        inputLabel: 'Enter location name :',
        inputPlaceholder: 'e.g. "Puki\'s House"'
    })
        .then((res) => {
            if (res.isConfirmed && res.value.length > 0) {
                const locName = res.value
                mapService.getGeoLoc(elInputSearch.value)
                    .then(geoLoc => {
                        const locId = locService.addLoc(locName, geoLoc.geoName, geoLoc.lat, geoLoc.lng);
                        mapService.addMarker(locId);
                        renderLocationName(geoLoc.geoName);
                        renderLocs()
                        elInputSearch.value = '';
                        locService.getWeather(geoLoc.lat, geoLoc.lng)
                            .then(renderWeather)
                    })
            }
        })
}