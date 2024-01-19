const expressAsyncHandler = require("express-async-handler");
const { mongoose, isValidObjectId } = require("mongoose");
const { AppError } = require("../../utils/errorHandling/AppErrors");

const mustAdminMiddleware = expressAsyncHandler(async (req, res, next) => {
    let user = req?.user;

    if (user && !user?.isAdmin) {
        throw new AppError(`Access Denied`, 401)
    }

    next()
})

module.exports = isAdminMiddleware