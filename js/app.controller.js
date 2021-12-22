import { locService } from './services/location.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.renderLocs = renderLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    mapService.initMap()
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
                    <button class="fa" onclick="onPanTo(${loc.lat, loc.lng})">Go</button>
                    <button class="fa" onclick="onDeleteLoc(${loc.id})">Delete</button>
                </td>
            </tr>`)
            document.querySelector('.locs-table tbody').innerHTML = locsHTMLs.join('');
            // console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}