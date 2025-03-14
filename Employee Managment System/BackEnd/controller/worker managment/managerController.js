const managerSchema = require('../../model/managerSchema');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');

module.exports.managerList = async (req, res) => {
    if (req.user.adminData) {
        const adminData = req.user.adminData;
        await managerSchema.find({ adminId: adminData._id }).then((data) => {
            res.status(200).json({ message: "All Manager Data", managerData: data });
        }) 
    }else if(req.user.managerData){
        await managerSchema.find().then((data) => {
            res.status(200).json({ message: "All Manager Data", managerData: data });
        }).catch((err) => {
            res.status(500).json({ message: "You Are Not Eligible To see Data", err });
        });
    }else{
        res.status(500).json({ message: "You Are Not Eligible To see Data"});
    }
}

module.exports.managerRegister = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    req.body.image = req.file.path;
    req.body.password = await bcryptjs.hash(req.body.password, 10);
    req.body.adminId = req.user.adminData._id;
    await managerSchema.create(req.body).then(async (data) => {
        const populatedData = await managerSchema.findById(data._id).populate('adminId');
        res.status(200).json({ message: "Manager Created Successfully", data: populatedData });
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
}

module.exports.managerLogin = async (req, res) => {
    let manager = await managerSchema.findOne({ email: req.body.email });

    if (!manager) {
        return res.status(404).json({ message: "Manager Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, manager.password)) {
        let token = jwt.sign({ managerData: manager }, "employee000", { expiresIn: "1h" });
        res.status(200).json({ message: "Manager Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
}

module.exports.deleteManager = async (req, res) => {
    const data = await managerSchema.findByIdAndDelete(req.query.id);
    if (!data) {
        return res.status(404).json({ message: "Manager not found" });
    }
    if (data.image && fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
    }
    res.status(200).json({ message: "This Manager is Deleted", data });
}

module.exports.updateManager = async (req, res) => {
    const manager = await managerSchema.findById(req.query.id);
    if (!manager) {
        return res.status(404).json({ message: "Manager not found" });
    }

    if (!req.file) {
        req.body.image = manager.image;
    } else {
        if (fs.existsSync(manager.image)) {
            fs.unlinkSync(manager.image);
        }
        req.body.image = req.file.path;
    }

    const data = await managerSchema.findByIdAndUpdate(req.query.id, req.body, { new: true });
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

    const compare = await bcryptjs.compare(req.body.oldPassword, manager.password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    manager.password = await bcryptjs.hash(req.body.newPassword, 10);
    await manager.save();
    res.status(200).json({ message: "Password changed successfully" });
}

// module.exports.forgotPassword = async (req, res) => {
//     let manager = await managerSchema.findOne({ email: req.body.email });
//     if (!manager) {
//         return res.status(404).json({ message: "Manager Not Found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     manager.resetOtp = otp;
//     await manager.save();

//     sendOtp(manager.email, otp);
//     res.status(200).json({ message: "OTP sent to email" });
// }

// module.exports.resetPassword = async (req, res) => {
//     let manager = await managerSchema.findOne({ email: req.body.email, resetOtp: req.body.otp });
//     if (!manager) {
//         return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (req.body.newPassword !== req.body.confirmPassword) {
//         return res.status(400).json({ message: "New Password and Confirm Password do not match" });
//     }

//     manager.password = await bcryptjs.hash(req.body.newPassword, 10);
//     await manager.save();

//     res.status(200).json({ message: "Password reset successfully" });
// }

