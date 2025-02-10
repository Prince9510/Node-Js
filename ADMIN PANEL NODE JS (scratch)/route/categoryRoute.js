const express = require("express");
const route = express.Router();
const { categoryMulter } = require('../middleware/multer');
const passport = require('../middleware/passport');
const categoryController = require('../controller/categoryController');

route.get("/getCategorieForm", categoryController.getCategorieForm);
route.post("/addCategory", categoryMulter, categoryController.addCategory);
route.get("/viewCategory" , categoryController.viewCategory);
route.get("/deleteCategoryData" , categoryMulter , categoryController.deleteCategoryData)
route.get("/updateCategoryData" , categoryController.getUpdateCategoryForm)
route.post("/updateCategory" , categoryMulter , categoryController.updateCategory)

module.exports = route; 