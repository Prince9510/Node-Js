const express = require('express');
const extraSubCatCtl = require('../Controller/extraSubCatCtl');
const route = express.Router();

route.get("/addExtraSubCat", extraSubCatCtl.addExtraSubCat);
route.post("/addExtraSubCat", extraSubCatCtl.createExtraSubCat);
route.get("/viewExtraSubCategory", extraSubCatCtl.viewExtraSubCategory);
route.get("/updateExtraSubCategory", extraSubCatCtl.updateExtraSubCategoryPage);
route.post("/updateExtraSubCategory", extraSubCatCtl.updateExtraSubCategory);
route.get("/deleteExtraSubCategory", extraSubCatCtl.deleteExtraSubCategory);

module.exports = route;
