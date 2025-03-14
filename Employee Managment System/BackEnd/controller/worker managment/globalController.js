const adminSchema = require('../../model/adminSchema');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');



module.exports.forgotPassword = async (req, res) => {
    let admin = await adminSchema.findOne({ email: req.body.email });
    if (!admin) {
        return res.status(404).json({ message: "Admin Not Found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = otp;
    await admin.save();

    sendOtp(admin.email, otp);
    res.status(200).json({ message: "OTP sent to email" });
}

module.exports.resetPassword = async (req, res) => {
    let admin = await adminSchema.findOne({ email: req.body.email, resetOtp: req.body.otp });
    if (!admin) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    admin.password = await bcryptjs.hash(req.body.newPassword, 10);
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
}
