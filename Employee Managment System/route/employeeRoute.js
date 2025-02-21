const express = require('express');
const employeeRoute = express.Router();
const employeeController = require('../controller/employeeController');
const checkAdminOrManager = require('../middleware/checkAdminOrManager');
const authentication = require('../middleware/jwt');
const employeeMulter = require('../middleware/multer');

employeeRoute.post("/register", authentication, employeeMulter, employeeController.employeeRegister);
employeeRoute.post("/login", employeeController.employeeLogin);
employeeRoute.get("/list", authentication, checkAdminOrManager, employeeController.employeeList);
employeeRoute.get("/profile", authentication, employeeController.employeeProfile);
employeeRoute.post("/changePassword", authentication, employeeController.employeeChangePassword);
employeeRoute.post("/forgotPassword", employeeController.forgotPassword);
employeeRoute.post("/resetPassword", employeeController.resetPassword);
employeeRoute.delete("/delete", authentication, checkAdminOrManager, employeeController.deleteemployee);
employeeRoute.put("/update", authentication, employeeMulter, employeeController.updateemployee);

module.exports = employeeRoute;