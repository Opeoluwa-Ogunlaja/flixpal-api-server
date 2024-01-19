const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config")

const generateToken = (_id) => {
    const token = jwt.sign({ _id }, jwtSecret, {
        expiresIn: '20d'
    })

    return token
}

module.exports = generateToken