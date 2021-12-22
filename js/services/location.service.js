export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    setLocGeoName
}

import { utils } from '../utils.js'

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