// export const appController={onAddLoc}
import { locService } from './services/location.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;
window.onDeleteLoc = onDeleteLoc;
window.onSearch = onSearch;
window.onCopyLink = onCopyLink;

let gCurrLatLng = { lat: 32.0749831, lng: 34.9120554 }

function onInit() {
    renderLocs();
    const url = new URL(window.location.href);
    console.log(url);
    let lat = undefined;
    let lng = undefined;
    console.log(url.searchParams);
    if (url.searchParams.get('lat')) {
        lat = +url.searchParams.get('lat');
        console.log(lat);
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
                    <button class="loc-btn fas fa-location-arrow" onclick="onPanTo(${loc.lat + ',' + loc.lng})"></button>
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
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
    console.log(lat, lng);
    gCurrLatLng = { lat, lng }
}

function onAddLoc(mapEv) {
    console.log(mapEv.latLng.toJSON());
    const { lat, lng } = mapEv.latLng.toJSON();
    const name = prompt('Insert place name:');
    if (!name) return
    gCurrLatLng = { lat, lng };
    locService.addLoc(name, lat, lng);
    mapService.addMarker(gCurrLatLng);
    mapService.panTo(lat, lng);
    renderLocs();
}

function onDeleteLoc(locId) {
    if (!confirm('are you sure?')) return;
    locService.deleteLoc(locId);
    renderLocs();
}

function onSearch(ev) {
    ev.preventDefault();
    const elInputSearch = document.querySelector('input[type="search"]');
    mapService.getSearchedLoc(elInputSearch.value)
        .then(() => {
            renderLocs()
            elInputSearch.value = '';
        })
}

function onCopyLink() {
    const text = `https://noy25.github.io/Travel-Tip/index.html?lat=${gCurrLatLng.lat}&lng=${gCurrLatLng.lng}`
    navigator.clipboard.writeText(text);
}