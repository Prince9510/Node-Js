const express = require('express');
const catSubCtl = require('../Controller/catSubCtl');
const route = express.Router();

route.get("/addSubCat", catSubCtl.addSubCat);
route.post("/addSubCat", catSubCtl.addSubCategory);
route.get("/viewSubCat", catSubCtl.viewSubCat);
route.get("/deleteSubCategory", catSubCtl.deleteSubCategory);
route.get("/updateSubCategoryPage", catSubCtl.updateSubCategoryPage);
route.post("/updateSubCategory", catSubCtl.updateSubCategory);

module.exports = route;