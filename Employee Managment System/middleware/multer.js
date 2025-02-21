const multer = require('multer');

const Storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "uploads/");
    },
    filename : (req , file , cb) => {
        cb(null , file.fieldname + "-" + Date.now());
    }
})

const uploads = multer({storage : Storage}).single('image');

module.exports = uploads;