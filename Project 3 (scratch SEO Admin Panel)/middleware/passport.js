const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Admin = require('../model/adminSchema');

passport.use(
    "local",
    new localStrategy({usernameField : "email"},
        async (email, password, done) => {
            let adminEmail = await Admin.findOne({email : email});
            if(adminEmail){
                if(adminEmail.password == password){
                    console.log("Authentication successful for email:", email);
                    return done(null, adminEmail);
                }else{
                    console.log("Authentication failed for email:", email);
                    return done(null, false, { message: 'Incorrect password.' });
                }
            }else{
                console.log("No user found with email:", email);
                return done(null, false, { message: 'Incorrect email.' });
            }
    })
);

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async (userId,done)=>{
    let user = await Admin.findById(userId);
    done(null,user);
})

passport.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = passport;