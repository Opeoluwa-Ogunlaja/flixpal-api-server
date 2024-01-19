const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const validateMongodbId = require("../../core/validateMongodbId");
const User = require("../../models/User");
const { AppError } = require("../../utils/AppErrors");
const { jwtSecret } = require("../../core/config");
const updateStreak = require("../../utils/updateStreak");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (req?.cookies['Car__SIT']) {
            token = req?.cookies['Car__SIT'];
            if (token) {
                const decoded = jwt.verify(token, jwtSecret);
                const isValidId = validateMongodbId(decoded._id);
                if((await User.findById(decoded._id) == null) || !isValidId) { req.user = false }
                try {
                    // find the user by id
                    const user = await User.findById(decoded?._id).select("-password");
                    // Attatch the user to the request object
                    req.user = user;
                    updateStreak(req.user.id)
                } catch (error) {
                    req.user =  false                
                }
            }
            else {req.user = false}
    }
    else{
        req.user = false
    }

    next();
})

const mustAuthMiddleware = expressAsyncHandler(async (req, res, next) => {
    if (req.user == false || req.user == null || req.user == undefined) throw new AppError("Not Authorised, Login again", 401)
    next()
})

const mustNotAuthMiddleware = expressAsyncHandler(async (req, res, next) => {
    if ( req.user ) throw new AppError("You have to log out before carrying out this action", 403)
    next()
})


module.exports = { authMiddleware, mustAuthMiddleware, mustNotAuthMiddleware };