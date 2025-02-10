const express = require("express");
const adminSchema = require('../model/adminSchema');
const fs = require('fs');
const mailer = require('../middleware/mailer');
const path = require('path');

module.exports.getLoginForm = async (req, res) => {
    res.render("login", { messages: req.flash() });
}

module.exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}


module.exports.dashboard = async (req , res) => {
    res.render("Dashboard");
} 

module.exports.getAdminForm = async (req,res) => {
    res.render("adminForm");
}

module.exports.addAdminData = async (req,res) => {
    req.body.adminPicture = req.file.path; // Ensure the correct field name is used
    console.log(req.file)
    await adminSchema.create(req.body).then((data)=>{
        res.redirect("/getAdminForm");
    })
}

module.exports.viewAdmin = async (req , res) => {
    await adminSchema.find({}).then((data) => {
        res.render("viewAdmin" , { data });
    })
}

module.exports.deleteAdminData = async (req , res) => {
    let admin = await adminSchema.findById(req.params.id);
    if (admin) {
        if (fs.existsSync(admin.adminPicture)) {
            fs.unlinkSync(admin.adminPicture); // Delete the image file if it exists
        }
        await adminSchema.findByIdAndDelete(req.params.id).then((data) => {
            res.redirect("/viewAdmin");
        });
    } else {
        res.redirect("/viewAdmin");
    }
}

module.exports.getAdminUpdateForm = async (req , res) => {
    await adminSchema.findById(req.params.id).then((data)=>{
        res.render("updateAdminData", { data })
        
    })
}

module.exports.updateAdminData = async (req , res) => {
    let img = "";
    let singleData = await adminSchema.findById(req.params.id);
    req.file ? img = req.file.path : img = singleData.adminPicture;
    if (req.file && singleData.adminPicture) {
        fs.unlinkSync(singleData.adminPicture); // Delete the old image file
    }
    req.body.adminPicture = img; // Ensure the correct field name is used
    let data = await adminSchema.findByIdAndUpdate(req.params.id , req.body);
    if (data) {
        req.session.adminPicture = img; // Update session with new admin picture
        res.redirect("/viewAdmin");
    }
}


module.exports.getForgotPassword = async (req , res) => {
    res.render("forgotPassword");
}

module.exports.recoverPass = async (req, res) => {
    console.log("Email received for OTP:", req.body.forgotEmail); // Debugging line
    let admin = await adminSchema.findOne({ adminEmail: req.body.forgotEmail });
    if (!admin) {
        console.log("Admin not found for email:", req.body.forgotEmail);
        return res.redirect("/");
    }
    let otp = Math.floor(Math.random() * 100000 + 400000);
    console.log("Generated OTP:", otp);
    try {
        await mailer.sendOtp(req.body.forgotEmail, otp);
        req.session.otp = otp;
        req.session.adminData = admin;
        res.render("forgotPassword");
    } catch (error) {
        console.log("Error sending OTP:", error);
        res.redirect("/");
    }
};

module.exports.verifyPass = async (req, res) => {
    let otp = req.body.otp;
    let admin = req.session.adminData;
    if (req.body.otp == otp) {
        if (req.body.newPassword == req.body.confirmPassword) {
            let adminData = await adminSchema.findByIdAndUpdate(admin._id, { adminPassword: req.body.newPassword });
            if (adminData) {
                console.log("Password updated successfully");
                res.redirect("/");
            } else {
                console.log("Error updating password");
                res.redirect("/forgotPassword");
            }
        } else {
            console.log("New Password and Confirm Password is Not Same");
            res.redirect("/forgotPassword");
        }
    } else {
        console.log("Invalid OTP");
        res.redirect("/forgotPassword");
    }
};


module.exports.getChangePasswordPage = async (req, res) => {
    res.render("changePassword");
}

module.exports.changePassword = async (req, res) => {
   
    let user = req.user;
    console.log(req.body);
  
    if (user.adminPassword === req.body.oldPassword) {
      if (req.body.oldPassword !== req.body.newPassword) {
        if (req.body.newPassword === req.body.confrimPassword) {
          let admin = await adminSchema.findByIdAndUpdate(user.id, { adminPassword: req.body.newPassword });
          admin && res.redirect("/");
        } else {
          console.log("New and confirm password must be the same");
        }
      } else {
        console.log("Old and new password must be different");
      }
    } else {
      console.log("Old password is incorrect");
    }
   
}