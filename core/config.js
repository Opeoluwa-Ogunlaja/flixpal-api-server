const mongoUrl = process.env.MONGO_URL
const port = process.env.PORT
const jwtSecret = process.env.JWT_SECRET
const served = process.env.NODE_ENV == 'serve'
const GclientID = process.env.GclientID, GclientSecret = process.env.GclientSecret;
const FclientID = process.env.FclientID, FclientSecret = process.env.FclientSecret;
const siteAddress = process.envv.BASE_URL || "http://localhost:3000";

module.exports = {
    mongoUrl,
    port,
    jwtSecret,
    served,
    GclientID,
    FclientID,
    GclientSecret,
    FclientSecret,
    siteAddress
}