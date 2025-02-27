const express = require("express");
const route = express.Router();
const productCtl = require('../Controller/productCtl');
const multer = require('../middleware/multer');
const passport = require("../middleware/passport");

route.get("/addProduct", productCtl.addViewProduct);
route.post("/addProduct", multer, productCtl.addProduct);
route.get("/viewProduct", productCtl.viewProduct);
route.get("/deleteProduct", productCtl.deleteProduct);

// Add routes for updating the product
route.get("/updateProduct", productCtl.updateProductPage);
route.post("/updateProduct", multer, productCtl.updateProduct);

module.exports = route;