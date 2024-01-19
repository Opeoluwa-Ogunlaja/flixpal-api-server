const expressAsyncHandler = require("express-async-handler")
const { AppError } = require("../../utils/errorHandling/AppErrors")

const updateThresMiddleware18 = expressAsyncHandler(async (req, res, next) => {
    if (req.user == false) throw new AppError("Not Authorised, Login again", 401)
    
    const lastUpdated = new Date(req?.user?.updatedAt)
    const time = new Date()
    
    let dt = time.getTime() - lastUpdated.getTime()
    
    if (dt < ((3/4) * 86400000)) throw new AppError('You can only update your info once in 12 hours', 403)

    next()
})

const updateThresMiddleware24 = expressAsyncHandler(async (req, res, next) => {
    if (req.user == false) throw new AppError("Not Authorised, Login again", 401)
    
    const lastUpdated = new Date(req?.user?.updatedAt)
    const time = new Date()
    
    let dt = time.getTime() - lastUpdated.getTime()
    // console.log(dt);
    
    if (dt < 86400000) throw new AppError('You can only update your info once in 24 hours', 403)

    next()
})

module.exports = {
    updateThresMiddleware24,
    updateThresMiddleware18
}