const express = require("express");
const route = express.Router();
const mainController = require("../controller/mainController");
const { adminMulter } = require('../middleware/multer');
const passport = require('../middleware/passport');

route.get("/", mainController.getLoginForm);
route.post("/login", passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}));
route.get("/dashboard", passport.checkAuth, mainController.dashboard);
route.get("/getAdminForm", passport.checkAuth, mainController.getAdminForm);
route.post("/addAdminData", passport.checkAuth, adminMulter, mainController.addAdminData);
route.get("/viewAdmin", passport.checkAuth, mainController.viewAdmin);
route.get("/deleteAdminData/:id", passport.checkAuth, mainController.deleteAdminData);
route.get("/updateAdminData/:id", passport.checkAuth, mainController.getAdminUpdateForm);
route.post("/updateAdminData/:id", passport.checkAuth, adminMulter, mainController.updateAdminData);
route.post("/getotp", mainController.recoverPass);
route.post("/forgotPassword", mainController.verifyPass);
route.get("/logout", passport.checkAuth, mainController.logout);
route.get("/forgotPassword", mainController.getForgotPassword);
route.get("/changePassword", mainController.getChangePasswordPage);
route.post("/changePassword", mainController.changePassword);

module.exports = route;