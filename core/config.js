const mongoUrl = process.env.MONGO_URL
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECRET
const served = process.env.NODE_ENV == 'serve'
const GclientID = process.env.GclientID, GclientSecret = process.env.GclientSecret;
const siteAddress = "https://flixpal-dev.onrender.com";

module.exports = {
    mongoUrl,
    port,
    jwtSecret,
    served,
    GclientID,
    GclientSecret,
    siteAddress
}