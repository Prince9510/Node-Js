const express = require("express");
const port = 5173;
const app = express();
const db = require("./config/db");
const path = require("path");
const cookie = require('cookie-parser');
const session = require('express-session');
const passport = require("./middleware/passport");
const catRoute = require('./Routes/catRoute'); // Import the catRoute
const catSubRoute = require('./Routes/catSubRoute'); // Import the catSubRoute
const ExtraSubCategory = require('./Routes/extraSubCatRoute'); // Import the catSubRoute
const Product = require('./Routes/productRoute'); // Import the Products


app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use("/public",express.static(path.join(__dirname,"public"))); 
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(cookie());
app.use(session({
  name : "local",
  secret: 'no secret',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge : 100 * 100 * 60 }
})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticateUser);

app.get("/login" , (req , res) => {
  res.render("login")
})

app.use("/",require('./Routes/route'));
app.use("/", catRoute); // Use the catRoute
app.use("/", catSubRoute); // Use the catSubRoute
app.use("/", ExtraSubCategory); // Use the Extra category
app.use("/", Product); // Use the Products

app.listen(port, (err)=>{
err?console.log(err):console.log(`http://localhost:${port}`);
});