const express = require('express');
const port = 5173;
const app = express();
const path = require('path');
const cookie = require('cookie-parser');
const dataBase = require('./config/dataBase')
const route = require('./Route/route');
const session = require('express-session');
const passport = require("passport");

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded());
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
app.use('/', route);

app.listen(port , (err)=>{
    err ? console.log(err) : console.log("Bluetooth Device Connected Successfully " + port);
})