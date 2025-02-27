const express = require("express");
const route = express.Router();
const ctl = require('../Controller/clt');
const multer = require('../middleware/multer');
const passport = require("../middleware/passport");

// Middleware to set res.locals.user
route.use((req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
});

route.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/dashboard");
    } else {
        ctl.login(req, res);
    }
});
route.get("/changePass", ctl.changePass);
route.post("/changePass", ctl.changePassData);
route.get("/myProfile", ctl.myProfile);
route.post("/login", passport.authenticate('local', { failureRedirect: '/' }), ctl.userLogin);
route.get("/logout", ctl.logout);
route.get("/dashboard",  ctl.admin);
route.get("/viewAdmin", passport.checkAuth, ctl.viewAdmin);
route.get("/addAdmin",  ctl.addAdmin);
route.post("/addAdmin", multer, ctl.addAdminData);
route.get("/deleteAdmin", ctl.deleteAdmin);
route.get("/updateAdminPage", passport.checkAuth, ctl.updateAdminPage);
route.post("/updateAdmin", multer, ctl.updateAdmin);
route.post("/recoverPass", ctl.recoverPass);
route.post("/verifyPass", ctl.verifyPass);



module.exports = route;