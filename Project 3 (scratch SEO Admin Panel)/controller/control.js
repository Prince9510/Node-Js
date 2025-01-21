const fs = require("fs");
const Admin = require('../model/adminSchema');
const path = require('path');

module.exports.login = (req, res) => {
    res.render("login");

}
 
module.exports.logout = (req, res) => {
    req.session.destroy();
  res.redirect("/");

}

module.exports.userLogin = async (req, res) => {
    console.log("userLogin function called");
    console.log("Login attempt for email:", req.body.email);
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
        console.log("Login successful for email:", req.body.email);
        res.redirect("/dashboard");
    } else {
        console.log("Login failed for email:", req.body.email);
        res.redirect("/");
    }
}

module.exports.dashboard = (req, res) => {
    res.render("dashboard", { adminData: req.user });
}

module.exports.addAdmin = (req, res) => {
    res.render('addAdmin', { adminData: req.user });
}

module.exports.addAdminData = async (req, res) => {
    console.log(req.body);
    console.log(req.file);

    req.body.image = req.file.path;
  await Admin.create(req.body).then((data) => {
    res.redirect("/addAdmin");
  });
}

module.exports.viewAdmin = async (req, res) => {
    const data = await Admin.find();
    res.render("viewAdmin", { data: Array.isArray(data) ? data : [], adminData: req.user });
}

module.exports.deleteAdmin = async (req, res) => {
    await Admin.findByIdAndDelete(req.query.id).then((data) => {
        res.redirect("/viewAdmin");
      })
}

module.exports.editAdmin = async (req, res) => {
    const data = await Admin.findById(req.query.id);
    res.render('editAdmin', { data, adminData: req.cookies.adminData });
}

module.exports.updateAdmin = async (req, res) => {
    let img = "";
    let singleData = await Admin.findById(req.body.id);
    req.file ? img = req.file.path : img = singleData.image;
    req.file && fs.unlinkSync(singleData.image);
    req.body.image = img;
    await Admin.findByIdAndUpdate(req.body.id, req.body);

    if (req.cookies.adminData && req.body.id === req.cookies.adminData._id.toString()) {
        let data = await Admin.findById(req.body.id);
        if (data) {
            res.cookie("adminData", data);
        }
    }
    res.redirect("/viewAdmin");
}