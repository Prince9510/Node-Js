const express = require('express');
const route = express.Router();
const control = require('../controller/control');
const multer = require('../middleware/multer');
const passport = require('../middleware/passport');

route.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/dashboard");
    } else {
        control.login(req, res);
    }
});
route.post("/userLogin", 
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
        console.log("Redirecting to /dashboard after successful login");
        res.redirect('/dashboard');
    }
);

route.get("/logout", control.logout);
route.get("/dashboard", passport.checkAuth, control.dashboard);
route.get("/addAdmin",passport.checkAuth, control.addAdmin);
route.get("/viewAdmin", passport.checkAuth, control.viewAdmin);
route.post("/addAdminData", multer, control.addAdminData);
route.get("/deleteAdmin",multer , control.deleteAdmin);
route.get("/editAdmin",passport.checkAuth,control.editAdmin);
route.post("/updateAdmin", multer, control.updateAdmin);

module.exports = route;