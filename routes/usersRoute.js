const express = require('express')
// const { register, login, deleteUser, logout, profile } = require('../controllers/user')
const { register, login, google_failure, google_success, facebook_failure,facebook_success } = require('../controllers/user')
const { authMiddleware, mustAuthMiddleware } = require('../middlewares/auth/authMiddleware')
const userRouter = express.Router()
const passport = require('passport')
const { getUrlFromPath } = require('../utils/urlUtils')

// Signup route
userRouter.post('/register', register)

// Login route
userRouter.post('/login', login)


// Google Auth consent screen route
userRouter.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

// Google Call back route
userRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: getUrlFromPath('google-auth-failed', 'auth'),
    }),
    function (req, res) {
        res.redirect(getUrlFromPath('google-auth-success', 'auth'))
    }
);

userRouter.get('/google-auth-failed', google_failure)

userRouter.get('/google-auth-success', google_success)

userRouter.get('/facebook',
    passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages'] }));

// Facebook Call back route
userRouter.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: getUrlFromPath('facebook-auth-failed', 'auth'),
    }),
    function (req, res) {
        res.redirect(getUrlFromPath('facebook-auth-success', 'auth'))
    }
);

userRouter.get('/facebook-auth-failed', facebook_failure)

userRouter.get('/facebook-auth-success', facebook_success)

// Profile route
// userRouter.get('/profile', authMiddleware, mustAuthMiddleware , profile)

// Delete User
// userRouter.delete('/delete/:id', deleteUser)

// Logout User
// userRouter.get('/logout', logout)

module.exports = userRouter;