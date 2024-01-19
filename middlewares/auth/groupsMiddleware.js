const expressAsyncHandler = require("express-async-handler");
const { AppError } = require("../../utils/errorHandling/AppErrors");
const Group = require("../../models/group/Group");

const mustBeGroupAdminMiddleware = expressAsyncHandler(async (req, res, next) => {
    let user = req?.user;
    const { groupId } = req?.params

    const groupFound  = await Group.findById(groupId)

    if (user._id !== groupFound.author || !(user._id in groupFound.admins)) throw new AppError('You have to be a group admin to perform this action')

    next()
})

const mustBeGroupCreatorMiddleware =  expressAsyncHandler(async (req, res, next) => {
    let user = req?.user;
    const { groupId } = req?.params

    const groupFound  = await Group.findById(groupId)

    if (user._id !== groupFound.author) throw new AppError('You have to be the group author to perform this action')

    next()
})

module.exports = {
    mustBeGroupCreatorMiddleware,
    mustBeGroupAdminMiddleware
}