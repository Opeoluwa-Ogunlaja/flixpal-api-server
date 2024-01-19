const dotenv = require('dotenv')

dotenv.config()

const { port } = require("./core/config");
const dbConnection = require("./core/dbConnection");
const app = require("./core/express");

dbConnection()

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})