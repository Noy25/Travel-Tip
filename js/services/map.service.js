export const mapService = {
    initMap,
    addMarker,
    panTo,
    getPosition,
    getGeoLoc,
    deleteMarker
}
import { locService } from './location.service.js'

const GEO_API_KEY = 'AIzaSyCVc806N2WWOK0bNSHTXEBKtAjdb3FhvmM';

let gMap;
const gMarkers = [];


function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            locService.getLocs()
                .then(locs => locs.forEach(loc => addMarker(loc)))
            return gMap
        })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyAwzx_-3Ln2T1cFrXbqPwyuBhpVIA4N2IY';
    const elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function addMarker(loc) {

    const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: gMap,
        title: loc.name,
        animation: google.maps.Animation.DROP,
        id: loc.id,
        icon: 'imgs/pin.png'
    });
    gMarkers.push(marker);
}

function deleteMarker(markerId) {
    const markerIdx = gMarkers.findIndex(marker => marker.id === markerId);
    gMarkers[markerIdx].setMap(null);
    gMarkers.splice(markerIdx, 1);
}

function panTo(lat, lng) {
    const latLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(latLng);
}

function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function getGeoLoc(searchedLoc, locLat, locLng) {
    let searchStr;
    let url;

    if (searchedLoc) {
        searchStr = searchedLoc.replaceAll(' ', '+');
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchStr}&key=${GEO_API_KEY}`
    } else {
        searchStr = `latlng=${locLat},${locLng}`
        url = `https://maps.googleapis.com/maps/api/geocode/json?${searchStr}&key=${GEO_API_KEY}`
    }

    return axios.get(url)
        .then(ans => {
            const geoName = ans.data.results[0].formatted_address;
            const { lat, lng } = ans.data.results[0].geometry.location;
            panTo(lat, lng);
            return { lat, lng, geoName }
        })
}