const express = require("express");
const route = express.Router();
const productController = require("../controller/productController");
const { productMulter } = require('../middleware/multer');
const passport = require('../middleware/passport');

route.get("/addProduct", productController.getProductForm);
route.post("/addProduct", productMulter, productController.addProduct);
route.get("/viewProduct", productController.viewProduct);
route.get("/deleteProduct", productController.deleteProduct); // Added delete route
route.get("/updateProduct", productController.getUpdateProductForm); // Added route for update form
route.post("/updateProduct", productMulter, productController.updateProduct); // Added route for update submission

module.exports = route;