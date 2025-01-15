const express = require('express');
const route = express.Router();
const control = require('../controller/control');
const multer = require('../middleware/multer');

route.get("/", control.login);
route.get("/logout", control.logout);
route.post("/userLogin", control.userLogin);
route.get("/dashboard", control.dashboard);
route.get("/addAdmin", control.addAdmin);
route.get("/viewAdmin", control.viewAdmin);
route.post("/addAdminData", multer, control.addAdminData);
route.get("/deleteAdmin",multer , control.deleteAdmin);
route.get("/editAdmin",multer,control.editAdmin);
route.post("/updateAdmin", multer, control.updateAdmin);

module.exports = route;