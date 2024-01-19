const mongoose = require('mongoose');
const { mongoUrl } = require('./config');

const dbConnection = async () => {
    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(mongoUrl);
        console.log('DB connected successfully');
    
        return conn
    } catch (error) {
        console.log(`${error.message}`)
    }
}

module.exports = dbConnection