const express = require('express');
const adminRoute = express.Router();
const adminMulter = require('../middleware/multer');
const adminController = require('../controller/adminController');
const authentication = require('../middleware/jwt');

adminRoute.post("/register", adminMulter, adminController.adminRegister);
adminRoute.post("/login", adminController.adminLogin);
adminRoute.get("/adminList", authentication, adminController.adminList);
adminRoute.get("/adminProfile", authentication, adminController.adminProfile);
adminRoute.post("/changePassword", authentication, adminController.adminChangePassword);
adminRoute.post("/forgotPassword", adminController.forgotPassword);
adminRoute.post("/resetPassword", adminController.resetPassword);
adminRoute.delete("/delete", authentication, adminMulter, adminController.deleteAdmin);
adminRoute.put("/update", authentication, adminMulter, adminController.updateAdmin);

module.exports = adminRoute;