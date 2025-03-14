const multer = require('multer');
const path = require('path');

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const uploads = multer({ storage: Storage }).single('image');

module.exports = uploads;   