const multer = require('multer');
const path = require('path');

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

const adminMulter = multer({ storage: Storage }).single('adminPicture');
const categoryMulter = multer({ storage: Storage }).single('categoryImage');
const subCategoryMulter = multer({ storage: Storage }).single('subCategoryImage');
const productMulter = multer({ storage: Storage }).single('productImage');

module.exports = {
    adminMulter,
    categoryMulter,
    subCategoryMulter,
    productMulter
};