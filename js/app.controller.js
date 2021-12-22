// export const appController={onAddLoc}
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

let gCurrLatLng = { lat: 32.0749831, lng: 34.9120554 }

function onInit() {
    renderLocs();
    const url = new URL(window.location.href);
    let lat;
    let lng;
    if (url.searchParams.get('lat')) {
        lat = +url.searchParams.get('lat');
        lng = +url.searchParams.get('lng');
    }
    mapService.initMap(lat, lng)
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function renderLocs() {
    locService.getLocs()
        .then(locs => {
            const locsHTMLs = locs.map(loc => `
            <tr>
                <td>${loc.name}</td>
                <td>
                    <button class="loc-btn fas fa-location-arrow" onclick="onGoTo('${loc.id}')"></button>
                    <button class="loc-btn fas fa-trash" onclick="onDeleteLoc('${loc.id}')"></button>
                </td>
            </tr>`)
            document.querySelector('.locs-table tbody').innerHTML = locsHTMLs.join('');
        })
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
    // console.log('Panning the Map');
    // mapService.panTo(lat, lng);
    // console.log(lat, lng);
    // gCurrLatLng = { lat, lng }

    locService.getLocs()
        .then(locs => {
            const locSelected = locs.find(loc => locId === loc.id)
            const { lat, lng, name, geoName } = locSelected
            mapService.panTo(lat, lng);
            renderLocationName(geoName, name);
        })
}

function onAddLoc(mapEv) {
    const { lat, lng } = mapEv.latLng.toJSON();
    const name = prompt('Insert place name:');
    if (!name) return
    gCurrLatLng = { lat, lng };
    mapService.getGeoLoc(undefined, lat, lng)
        .then(geoLoc => {
            const locId = locService.addLoc(name, geoLoc.geoName, geoLoc.lat, geoLoc.lng);
            mapService.addMarker(locId);
            renderLocationName(geoLoc.geoName, name);
            renderLocs();
        })
}

function onDeleteLoc(locId) {
    if (!confirm('are you sure?')) return;
    locService.deleteLoc(locId);
    mapService.deleteMarker(locId);
    renderLocs();
}

function onSearch(ev) {
    ev.preventDefault();
    const elInputSearch = document.querySelector('input[type="search"]');
    if (!elInputSearch.value) return;
    const name = prompt('Insert place name:');
    mapService.getGeoLoc(elInputSearch.value)
        .then(geoLoc => {
            const locId = locService.addLoc(name, geoLoc.geoName, geoLoc.lat, geoLoc.lng);
            mapService.addMarker(locId);
            renderLocationName(geoLoc.geoName);
            renderLocs()
            elInputSearch.value = '';
        })
}

function onCopyLink() {
    const text = `https://noy25.github.io/Travel-Tip/index.html?lat=${gCurrLatLng.lat}&lng=${gCurrLatLng.lng}`
    navigator.clipboard.writeText(text);
}

function renderLocationName(geoLocName, locName) {
    const elLocationName = document.querySelector('.curr-location span');
    elLocationName.innerText = (locName) ? `${locName} (${geoLocName})` : geoLocName;
}