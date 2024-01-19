const User = require("../models/User")

module.exports = async function  updateStreak(userId){
    const user = await User.findById(userId)

    const today = (new Date()).toLocaleDateString('en-NG', { dateStyle: 'medium' })

    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterday = yesterdayDate.toLocaleDateString('en-NG', {dateStyle: 'medium'})

    const lastLoginFormatted = user.lastLogin.toLocaleDateString('en-NG', { dateStyle: 'medium' })

    if (lastLoginFormatted == today) {

    }
    else if(lastLoginFormatted == yesterday){
        user.streakCount += 1;
    }
    else{
        user.streakCount = 1;
    }

    user.lastLogin = new Date();

    await user.save()
}