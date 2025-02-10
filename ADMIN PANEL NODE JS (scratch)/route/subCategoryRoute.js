const express = require("express");
const route = express.Router();
const subCategoryController = require("../controller/subCategoryController");
const { subCategoryMulter } = require('../middleware/multer');
const passport = require('../middleware/passport');


route.get("/addSubCategory" , subCategoryController.getSubCategoryForm)
route.post("/addSubCategory" , subCategoryMulter , subCategoryController.addSubCategory)
route.get("/viewSubCategory" , subCategoryMulter , subCategoryController.viewSubCategory)
route.get("/deleteSubCategoryData" , subCategoryMulter , subCategoryController.deleteSubCategoryData)
route.get("/updateSubCategoryData" , subCategoryMulter , subCategoryController.updateSubCategoryForm)
route.post("/updateSubCategoryData" , subCategoryMulter , subCategoryController.updateSubCategory)



module.exports = route;
