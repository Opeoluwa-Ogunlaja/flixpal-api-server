const multer = require('multer')
const path = require('path')
const fs = require('fs');
const { AppError } = require('../../utils/AppErrors');
const expressAsyncHandler = require('express-async-handler');

// Storage
const multerStorage = multer.memoryStorage();

// File Checking
const multerFilter = (req, file, cb) => {
    // Check the type
    if (file.mimetype.startsWith("audio")) {
        cb(null, true)
    }
    else{
        // Rejected files
        cb({
            message: "Unsuported file format"
        }, false
        )
    }
}

const audioUpload = limit => multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

// Profile Image reszing
const audioPlacement = expressAsyncHandler(async (req, res, next) => {
    // Check if there is no file
    if (!req.file) return next()

    req.file.fileName = `${req.user.username}-${Date.now()}-${req.file.originalname}`

    try{
        fs.writeFile(path.join(`public/audio/recordings/${req.file.fileName}`), req?.file.buffer, (err) => {
            if (err) throw new AppError(err)
        });
        next()
    }
    catch(e) {
        console.log(e);
        throw new AppError(e)
    }
})



module.exports = { audioUpload, audioPlacement }