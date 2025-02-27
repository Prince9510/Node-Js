const express = require("express");
const route = express.Router();
const multer = require('../middleware/multer');
const catCtl = require('../Controller/catCtl'); // Import the controller

route.get("/addCat", catCtl.showCat);
route.post("/addCat", multer, catCtl.addCat); // Use multer middleware for file upload
route.get("/addCat", catCtl.showCat);
route.get("/viewCat", catCtl.viewCat);
route.get("/updateCategoryPage" , catCtl.updateCategoryPage);
route.post("/updateCategory" , multer, catCtl.updateCategory); // Use multer middleware for file upload
route.get("/deleteCategory" ,multer, catCtl.deleteCategory); // Use multer middleware for file upload

module.exports = route;