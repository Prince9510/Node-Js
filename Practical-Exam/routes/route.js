const express = require("express");
const route = express.Router();
const indexctl = require("../controller/indexCtl");
const Userauth = require("../middleware/auth");

route.get("/", indexctl.Register);
route.post("/sendData", indexctl.SignUpData);
route.get("/login", indexctl.Login);
route.post("/loginData", indexctl.LoginData);
route.get("/logout", indexctl.Logout);
route.get("/navbar", Userauth, indexctl.Navbar);
route.get("/taskform", Userauth, indexctl.taskform);
route.get("/tasklist", Userauth, indexctl.tasklist);
route.post("/insert", Userauth, indexctl.addData);
route.get("/delete", Userauth, indexctl.deleteData);
route.get("/edit", Userauth, indexctl.EditData);
route.post("/update", Userauth, indexctl.UpdateData);

module.exports = route;
