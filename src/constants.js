const DEVELOPED_BASE_URL = 'netcmdb-loc.rs.ru:8082'
const BASE_URL = (() => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    const developMode = hostname === 'localhost'
    return developMode ? `${protocol}//${DEVELOPED_BASE_URL}` : `${protocol}//${hostname}${port==='' ? '' : ':'}${port}`
})()
export const DEV_DATA_URL = `${BASE_URL}/api/getDevData.json`
export const DEV_MODULES_DATA_URL = `${BASE_URL}/api/getDevModulesData.json`
export const DEV_PORTS_DATA_URL = `${BASE_URL}/api/getDevPortsData.json`
export const DEV_LOCATION_URL = `${BASE_URL}/api/getDevLocation.json`
export const VRF_LIST_URL= `${BASE_URL}/api/getVrfList.json`
export const DEV_SUBMIT_URL = `${BASE_URL}/api/saveDev.json`
export const REGIONS_URL = `${BASE_URL}/api/getRegions.json`
export const CITIES_URL = `${BASE_URL}/api/getCities.json`
export const OFFICES_URL = `${BASE_URL}/api/getOffices.json`
export const DEV_TYPES = `${BASE_URL}/api/getDevTypes.json`
export const PLATFORMS = `${BASE_URL}/api/getPlatforms.json`
export const SOFTWARE_LIST = `${BASE_URL}/api/getSoftwareList.json`
console.log("BASE API URL", BASE_URL)