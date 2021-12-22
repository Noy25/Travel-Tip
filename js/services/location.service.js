export const locService = {
    getLocs,
    addLoc,
    deleteLoc
}

import { utils } from '../utils.js'

const GEO_API_KEY = 'AIzaSyCVc806N2WWOK0bNSHTXEBKtAjdb3FhvmM';

const locs = [
    createLoc('Greatplace', 32.047104, 34.832384),
    createLoc('Neveragain', 32.047201, 34.832581)
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
    locs.push(createLoc(name, lat, lng));
}

function deleteLoc(locId) {
    const locIdx = locs.findIndex(loc => loc.id === locId);
    locs.splice(locIdx, 1);
}