const express = require('express')
const cookieParser = require('cookie-parser')
const compress = require('compression')
const cors = require('cors')
const { notFound, errorHandler } = require('../middlewares/error/errorHandlers')
const session = require('express-session')
const { jwtSecret } = require("./config");
const { mongoStore } = require('./sessionStore')
const userRouter = require('../routes/usersRoute')
const passport = require('passport')
const { getUrlFromPath } = require('../utils/urlUtils')
const { authMiddleware, mustAuthMiddleware } = require('../middlewares/auth/authMiddleware')

const app = express()

const allowedOrigins = ['http://localhost:5173']

// Core middleWares
app.use(express.json())
app.use(compress())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true)

        // if (!allowedOrigins.includes(origin)) {
        //     const err = new Error('CORS wahala 😂😂')
        //     return callback(err, false)
        // }

        return callback(null, true)
    }, credentials: true
}))
app.use(session({
    secret: jwtSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: true, sameSite: true },
    store: mongoStore
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser())

app.use(getUrlFromPath('', 'auth'), userRouter)

app.get('/', authMiddleware, mustAuthMiddleware, (req, res) => {
    return res.json({
        email: req?.user?.email,
        id: req?.user?._id
    })
})

// Error handlers
app.use(notFound)
app.use(errorHandler)


module.exports = app