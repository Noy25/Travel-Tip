// export const appController={onAddLoc}
import { locService } from './services/location.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetUserPos = onGetUserPos;
window.onAddLoc = onAddLoc;
window.onDeleteLoc = onDeleteLoc;

function onInit() {
    renderLocs();
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
                    <button class="fas fa-location-arrow" onclick="onPanTo(${loc.lat + ',' + loc.lng})">Go</button>
                    <button class="fas fa-trash" onclick="onDeleteLoc('${loc.id}')">Delete</button>
                </td>
            </tr>`)
            document.querySelector('.locs-table tbody').innerHTML = locsHTMLs.join('');
            // console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs)
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
}

function onAddLoc(mapEv) {
    console.log(mapEv.latLng.toJSON());
    const { lat, lng } = mapEv.latLng.toJSON();
    const name = prompt('Insert place name:');
    console.log(lat, lng);
    if (!name) return
    locService.addLoc(name, lat, lng);
    mapService.addMarker({ lat, lng });
    mapService.panTo(lat, lng);
    renderLocs();
}

function onDeleteLoc(locId) {
    if (!confirm('are you sure?')) return;
    locService.deleteLoc(locId);
    renderLocs();
}