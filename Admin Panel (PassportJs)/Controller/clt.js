const fs = require("fs");
const upload = require('../middleware/multer');
const Admin = require('../model/firstSchema');
const path = require('path');
const mailer = require("../middleware/mailer");

module.exports.login = (req, res) => {
  res.render("login");
}

module.exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
}

module.exports.myProfile = (req, res) => {
  res.render("profile");
}

module.exports.userLogin = async (req, res) => {
  console.log("Login attempt for email:", req.body.email);

  let admin = await Admin.findOne({ email: req.body.email });

  admin ? res.redirect("/dashboard") : res.redirect("/");

}

module.exports.admin = (req, res) => {
  res.render("dashboard");
};
module.exports.addAdmin = (req, res) => {
  res.render('addAdmin');
};

module.exports.addAdminData = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);

  req.body.image = req.file.path;
  await Admin.create(req.body).then((data) => {
    res.redirect("/addAdmin");
  });
};

module.exports.viewAdmin = async (req, res) => {
  const data = await Admin.find();
  res.render("viewAdmin", { data });
};

module.exports.deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.query.id).then((data) => {
    res.redirect("/viewAdmin");
    fs.unlinkSync(data.image);
  })
}

module.exports.updateAdminPage = async (req, res) => {
  const data = await Admin.findById(req.query.id);
  res.render("updateAdmin", { data });
};

module.exports.updateAdmin = async (req, res) => {
  let img = "";
  let singleData = await Admin.findById(req.body.id);
  req.file ? img = req.file.path : img = singleData.image;
  req.file && fs.unlinkSync(singleData.image);
  req.body.image = img;
  let data = await Admin.findByIdAndUpdate(req.body.id, req.body);
  data && res.redirect("/viewAdmin");
};

module.exports.changePass = (req, res) => {
  res.render("changePass");
};

module.exports.changePassData = async (req, res) => {
  let user = req.user;
  console.log(req.body);

  if (user.passWord === req.body.oldPassword) {
    if (req.body.oldPassword !== req.body.newPassword) {
      if (req.body.newPassword === req.body.confrimPassword) {
        let admin = await Admin.findByIdAndUpdate(user.id, { passWord: req.body.newPassword });
        admin && res.redirect("/logout");
      } else {
        console.log("New and confirm password must be the same");
      }
    } else {
      console.log("Old and new password must be different");
    }
  } else {
    console.log("Old password is incorrect");
  }
};

module.exports.recoverPass = async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    console.log("Admin not found for email:", req.body.email);
    return res.redirect("/");
  }

  let otp = Math.floor(Math.random() * 100000 + 400000);
  console.log("Generated OTP:", otp);

  mailer.sendOtp(req.body.email, otp);

  req.session.otp = otp;
  req.session.adminData = admin;

  res.render("verifyPass")
};

module.exports.verifyPass = async (req, res) => {
  let otp = req.body.otp;
  let admin = req.session.adminData;
  if (req.body.otp == otp) {
    if (req.body.newPassword == req.body.confirmPassword) {
      let adminData = await Admin.findByIdAndUpdate(admin._id, { passWord: req.body.newPassword });
      adminData && res.redirect("/");
    } else {
      console.log("New Password and Confirm Password is Not Same");
    }
  } else {
    res.redirect("/");
  }
}