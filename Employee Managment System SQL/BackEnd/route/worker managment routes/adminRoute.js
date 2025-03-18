const express = require('express');
const adminRoute = express.Router();
const adminMulter = require('../../middleware/multer');
const adminController = require('../../controller/worker managment/adminController');
const authentication = require('../../middleware/jwt');

adminRoute.post("/register", adminMulter, adminController.adminRegister);
adminRoute.post("/login", adminController.adminLogin);
adminRoute.get("/adminList", authentication, adminController.adminList);
adminRoute.get("/profile", authentication, adminController.adminProfile); // Ensure this route is defined
adminRoute.post("/changePassword", authentication, adminController.adminChangePassword);
adminRoute.delete("/delete", authentication, adminMulter, adminController.deleteAdmin);
adminRoute.put("/update", authentication, adminMulter, adminController.updateAdmin);



adminRoute.delete('/force-delete-manager', authentication, adminController.forceDeleteManager);
adminRoute.delete('/force-delete-employee', authentication, adminController.forceDeleteEmployee);

module.exports = adminRoute;