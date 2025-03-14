const adminSchema = require('../../model/adminSchema');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');

module.exports.adminList = async (req, res) => {
    await adminSchema.find({}).then((data) => {
        res.status(200).json({ message: "All Admin Data", data });
    });
}

module.exports.adminRegister = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    req.body.image = req.file.path;
    req.body.password = await bcryptjs.hash(req.body.password, 10);
    const admin = await adminSchema.create(req.body);
    const token = jwt.sign({ adminData: admin }, "employee000", { expiresIn: "1h" });
    res.status(200).json({ message: "Admin Created Successfully", token: token, data: admin });
}

module.exports.adminLogin = async (req, res) => {
    // let admin = await adminSchema.findOne({ email: req.body.email });
    let admin = await adminSchema.findOne({ email: req.body.email });

    // console.log(admin);

    console.log(req.body.email)
    console.log(req.body.password)
    
    if (!admin) {
        return res.status(404).json({ message: "Admin Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, admin.password)) {
        let token = jwt.sign({ adminData: admin }, "employee000", { expiresIn: "1h" });
        res.status(200).json({ message: "Admin Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
}

module.exports.deleteAdmin = async (req, res) => {
    await adminSchema.findByIdAndDelete(req.query.id).then((data) => {
        if (fs.existsSync(data.image)) {
            fs.unlinkSync(data.image);
        }
        res.status(200).json({ message: "This Admin Are Deleted", data })
    })
}

module.exports.updateAdmin = async (req, res) => {
    if (req.user.adminData._id !== req.query.id) {
        return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const data = await adminSchema.findByIdAndUpdate(req.query.id, req.body, { new: true });
    if (!data) {
        return res.status(404).json({ message: "Admin not found" });
    }
    if (fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
    }
    res.status(200).json({ message: "Admin is Updated", data });
}

module.exports.adminProfile = async (req, res) => {
    let profile = await adminSchema.findById(req.user.adminData._id);
    if (!profile) {
        return res.status(404).json({ message: "Admin Not Found" });
    }
    res.status(200).json({ message: "Admin Profile", data: profile });
}

module.exports.adminChangePassword = async (req, res) => {
    let admin = await adminSchema.findById(req.user.adminData._id);
    if (!admin) {
        return res.status(404).json({ message: "Admin Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, admin.password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }
    admin.password = await bcryptjs.hash(req.body.newPassword, 10);
    await admin.save();
    res.status(200).json({ message: "Password changed successfully" });
}

// module.exports.forgotPassword = async (req, res) => {
//     let admin = await adminSchema.findOne({ email: req.body.email });
//     if (!admin) {
//         return res.status(404).json({ message: "Admin Not Found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     admin.resetOtp = otp;
//     await admin.save();

//     sendOtp(admin.email, otp);
//     res.status(200).json({ message: "OTP sent to email" });
// }

// module.exports.resetPassword = async (req, res) => {
//     let admin = await adminSchema.findOne({ email: req.body.email, resetOtp: req.body.otp });
//     if (!admin) {
//         return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (req.body.newPassword !== req.body.confirmPassword) {
//         return res.status(400).json({ message: "New Password and Confirm Password do not match" });
//     }

//     admin.password = await bcryptjs.hash(req.body.newPassword, 10);
//     await admin.save();

//     res.status(200).json({ message: "Password reset successfully" });
// }
