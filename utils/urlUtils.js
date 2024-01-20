const { siteAddress } = require("../core/config")

const baseAPIslug = '/api'
const urlPoints = {
    base: "/",
    auth: '/auth'
}

const getUrlFromPath = function(url, point = 'base', inFull = false){
    return `${inFull ? siteAddress : ''}${baseAPIslug}${urlPoints[point]}${(url == '' || url == null) ? url : '/' + url}`
}

module.exports = {
    getUrlFromPath
}