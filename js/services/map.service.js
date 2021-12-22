export const mapService = {
    initMap,
    addMarker,
    panTo,
    getPosition,
    getSearchedLoc
}
import { locService } from './location.service.js'

const GEO_API_KEY = 'AIzaSyCVc806N2WWOK0bNSHTXEBKtAjdb3FhvmM';

let gMap;


function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            // Adds marker on location
            locService.getLocs()
                .then(locs => locs.forEach(loc => addMarker({ lat: loc.lat, lng: loc.lng })))
            // addMarker({ lat, lng });
            gMap.addListener("click", onAddLoc)
        })
}

function addMarker(loc) {
    const marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Location',
        animation: google.maps.Animation.DROP
    });
    return marker;
}

function panTo(lat, lng) {
    const latLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(latLng);

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

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function getSearchedLoc(searchedLoc) {
    const searchStr = searchedLoc.replaceAll(' ', '+');
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchStr}&key=${GEO_API_KEY}`)
        .then(ans => {
            const name = ans.data.results[0].formatted_address;
            const { lat, lng } = ans.data.results[0].geometry.location;
            panTo(lat, lng);
            locService.addLoc(name, lat, lng);
        })
}