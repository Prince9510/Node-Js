const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Admin = require('../model/firstSchema');

passport.use(
    "local",
    new localStrategy({usernameField : "email"},
        async (email, password, done) => {
            let adminEmail = await Admin.findOne({email : email});

            if(adminEmail){
                if(adminEmail.passWord == password){
                    return done(null, adminEmail);
                } else {
                    return done(null, false);
                }
            } else {    
                return done(null, false);
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

passport.checkAuth = ( req,res,next ) => {
    if(req.isAuthenticated()){
         next();
    }else{
        res.redirect("/");
    }
} 

passport.authenticateUser = (req,res,next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;