const managerSchema = require('../model/managerSchema');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../middleware/mailer');
const fs = require('fs');

module.exports.managerList = async (req, res) => {
    await managerSchema.find({}).then((data) => {
        res.status(200).json({ message: "All Manager Data", data });
    });
}

module.exports.managerRegister = async (req, res) => {
    req.body.image = req.file.path;
    req.body.managerPassword = await bcryptjs.hash(req.body.managerPassword, 10);
    req.body.adminId = req.user.adminData._id; 
    await managerSchema.create(req.body).then(async (data) => {
        const populatedData = await managerSchema.findById(data._id).populate('adminId');
        res.status(200).json({ message: "Manager Created Successfully", data: populatedData });
    });
}

module.exports.managerLogin = async (req, res) => {
    let manager = await managerSchema.findOne({ managerEmail: req.body.managerEmail });

    if (!manager) {
        return res.status(200).json({ message: "Manager Not Found" });
    }
    if (await bcryptjs.compare(req.body.managerPassword, manager.managerPassword)) {
        let token = jwt.sign({ managerData: manager }, "employee000", { expiresIn: "1h" });
        res.status(200).json({ message: "Manager Log In", token: token });
    } else {
        res.status(200).json({ message: "Password is wrong" });
    }
}

module.exports.deleteManager = async (req, res) => {
    await managerSchema.findByIdAndDelete(req.query.id).then((data) => {
        if (fs.existsSync(data.image)) {
            fs.unlinkSync(data.image);
        }
        res.status(200).json({ message: "This Manager is Deleted", data });
    });
}

module.exports.updateManager = async (req, res) => {
    if (req.user.managerData._id !== req.query.id) {
        return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    const data = await managerSchema.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!data) {
        return res.status(404).json({ message: "Manager not found" });
    }
    if (fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
    }
    res.status(200).json({ message: "Manager is Updated", data });
}

module.exports.managerProfile = async (req, res) => {
    let profile = await managerSchema.findById(req.user.managerData._id);
    if (!profile) {
        return res.status(404).json({ message: "Manager Not Found" });
    }
    res.status(200).json({ message: "Manager Profile", data: profile });
}

module.exports.managerChangePassword = async (req, res) => {
    let manager = await managerSchema.findById(req.user.managerData._id);
    if (!manager) {
        return res.status(404).json({ message: "Manager Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, manager.managerPassword);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }
    
    manager.managerPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await manager.save();
    res.status(200).json({ message: "Password changed successfully" });
}

module.exports.forgotPassword = async (req, res) => {
    let manager = await managerSchema.findOne({ managerEmail: req.body.managerEmail });
    if (!manager) {
        return res.status(404).json({ message: "Manager Not Found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    manager.resetOtp = otp;
    await manager.save();

    sendOtp(manager.managerEmail, otp);
    res.status(200).json({ message: "OTP sent to email" });
}

module.exports.resetPassword = async (req, res) => {
    let manager = await managerSchema.findOne({ managerEmail: req.body.managerEmail, resetOtp: req.body.otp });
    if (!manager) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    manager.managerPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await manager.save();

    res.status(200).json({ message: "Password reset successfully" });
}

