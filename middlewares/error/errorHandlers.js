const { AppError } = require("../../utils/AppErrors")

const notFound = (req, res, next) => {
    const error = new AppError(`Not found ${req.originalUrl}. Check the url or request method`, 404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const statusCode = !err.statusCode ? 500 : err.statusCode
    res.status(statusCode)
    res.json({
        message: err?.message,
        stack: process.env.NODE_ENV !== "development" ? err?.stack : undefined
    })
}

module.exports = {
    notFound,
    errorHandler
}