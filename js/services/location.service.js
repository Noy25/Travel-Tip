export const locService = {
    getLocs,
    addLoc,
    deleteLoc
}

import { utils } from '../utils.js'

const locs = [
    createLoc('Great place', 'Po', 32.047104, 34.832384),
    createLoc('Never again', 'Sham', 32.047201, 34.832581)
]

function getLocs() {
    return new Promise((resolve, reject) => {
        resolve(locs);
    })
}

function createLoc(name, geoName, lat, lng) {
    return {
        id: utils.getRandomId(),
        name,
        geoName,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function addLoc(name, geoName, lat, lng) {
    const loc = createLoc(name, geoName, lat, lng)
    locs.push(loc);
    return loc.id;
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId);
    locs.splice(locIdx, 1);
    console.log(locs);
}