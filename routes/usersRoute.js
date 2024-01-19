const express = require('express')
// const { register, login, deleteUser, logout, profile } = require('../controllers/user')
const { register, login } = require('../controllers/user')
const { authMiddleware, mustAuthMiddleware } = require('../middlewares/auth/authMiddleware')
const userRouter = express.Router()
const passport = require('passport')

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

// Call back route
userRouter.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/google-auth-failed',
    }),
    function (req, res) {
        res.redirect('/google-auth-success')

    }
);

userRouter.get('/google-auth-failed', async (req, res) => {
    res.send('Failed')
})

userRouter.get('/google-auth-success', async (req, res) => {
    res.json(req.user)
})

// Profile route
// userRouter.get('/profile', authMiddleware, mustAuthMiddleware , profile)

// Delete User
// userRouter.delete('/delete/:id', deleteUser)

// Logout User
// userRouter.get('/logout', logout)

module.exports = userRouter;