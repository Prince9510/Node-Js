const express = require('express');
const managerRoute = express.Router();
const managerController = require('../controller/managerController');
const authentication = require('../middleware/jwt');
const checkAdminOrManager = require('../middleware/checkAdminOrManager');
const managerMulter = require('../middleware/multer');

managerRoute.post("/register", authentication, managerMulter, managerController.managerRegister);
managerRoute.post("/login", managerController.managerLogin);
managerRoute.get("/list", authentication, checkAdminOrManager, managerController.managerList);
managerRoute.get("/profile", authentication, managerController.managerProfile);
managerRoute.post("/changePassword", authentication, managerController.managerChangePassword);
managerRoute.post("/forgotPassword", managerController.forgotPassword);
managerRoute.post("/resetPassword", managerController.resetPassword);
managerRoute.delete("/delete", authentication, checkAdminOrManager, managerController.deleteManager);
managerRoute.put("/update", authentication, managerMulter, managerController.updateManager);

module.exports = managerRoute;