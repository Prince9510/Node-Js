const http = require("http");
const express = require("express");
const port = 5173;
const app = express();
const dataBase = require('./config/dataBase');
const route = require('./route/route');
const path = require("path");
const cookie = require('cookie-parser');
const session = require('express-session');
const passport = require("./middleware/passport");
const flash = require('connect-flash');
const categoryRoute = require('./route/categoryRoute');
const subCategoryRoute = require('./route/subCategoryRoute');
const productRoute = require('./route/productRoute'); // Corrected import

app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname,"public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.set("view engine", "ejs");

app.use(cookie());
app.use(session({
    name: "local",
    secret: 'no secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 100 * 100 * 60 }
}));

app.use(flash()); // Add this line to use connect-flash
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticateUser);

app.use("/", route);
app.use("/", categoryRoute);
app.use("/", subCategoryRoute);
app.use("/", productRoute); // Corrected usage

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`http://localhost:${port}`);
});
