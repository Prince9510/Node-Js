const express = require('express');
const employeeRoute = express.Router();
const employeeController = require('../../controller/worker managment/employeeController');
const checkAdminOrManager = require('../../middleware/checkAdminOrManager');
const authentication = require('../../middleware/jwt');
const employeeMulter = require('../../middleware/multer');

employeeRoute.post("/register", authentication, employeeMulter, employeeController.employeeRegister);
employeeRoute.post("/login", employeeController.employeeLogin);
employeeRoute.get("/list", authentication, employeeController.employeeList);
employeeRoute.get("/profile", authentication, employeeController.employeeProfile);
employeeRoute.post("/changePassword", authentication, employeeController.employeeChangePassword);
employeeRoute.delete("/delete", authentication, checkAdminOrManager, employeeController.deleteEmployee);
employeeRoute.put("/update", authentication, employeeMulter, employeeController.updateEmployee);
employeeRoute.get("/getManagers", authentication, checkAdminOrManager, employeeController.getManagers);

module.exports = employeeRoute;