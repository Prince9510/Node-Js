const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const adminSchema = require('../model/adminSchema');

passport.use(
    "local",
    new localStrategy({ usernameField: "adminEmail" , passwordField : "adminPassword"},
        async (adminEmail, adminPassword, done) => {
            try {
                let admin = await adminSchema.findOne({ adminEmail: adminEmail });
                if (admin) {
                    if (admin.adminPassword == adminPassword) {
                        return done(null, admin);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                } else {
                    return done(null, false, { message: 'Incorrect email.' });
                }
            } catch (err) {
                return done(err);
            }
        })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        let user = await adminSchema.findById(userId);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
}

passport.authenticateUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;