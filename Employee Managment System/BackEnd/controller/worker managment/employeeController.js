const employeeSchema = require('../../model/employeeSchema');
const managerSchema = require('../../model/managerSchema');
const fs = require('fs');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');

module.exports.employeeList = async (req, res) => {
    if (req.user.adminData) {
        const adminData = req.user.adminData;
        const managerData = await managerSchema.find({ adminId: adminData._id }).populate('adminId');

        const employeeData = await employeeSchema
        .find({ managerId: { $in: managerData.map(m => m._id) } })  // Get employees of all these managers
        .populate('managerId'); 

        // console.log(employeeData)

        res.status(200).json({ message: "All Manager Data", managerData , employeeData });
    } else if (req.user.managerData) {
        const managerData = req.user.managerData;
        const employeeData = await employeeSchema.find({ managerId: managerData._id }).populate('managerId');

        res.status(200).json({ message: "All Employee Data", managerData, employeeData });

    } else if (req.user.employeeData) { 
        const employeeData = await employeeSchema.find({ managerId: req.user.employeeData.managerId }).populate('managerId');
        res.status(200).json({ message: "All Employee Data", employeeData });

        
    } else {
        res.status(200).json({ message: "unauthorized user" });
    }
}

// employee not show employee Data 

module.exports.employeeRegister = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
    }

    req.body.image = req.file.path;
    req.body.password = await bcryptjs.hash(req.body.password, 10);

    if (req.user.managerData) {
        req.body.managerId = req.user.managerData._id;
    } else if (req.user.adminData) {
        if (!req.body.managerId) {
            return res.status(400).json({ message: "Manager ID is required when admin is adding an employee" });
        }
        const manager = await managerSchema.findById(req.body.managerId);
        if (!manager || manager.adminId.toString() !== req.user.adminData._id.toString()) {
            return res.status(400).json({ message: "Invalid Manager ID" });
        }
        req.body.adminId = req.user.adminData._id;
    }

    await employeeSchema.create(req.body).then(async (data) => {
        const populatedData = await employeeSchema.findById(data._id)
            .populate('managerId')
            .populate('adminId');
        res.status(200).json({ message: "Employee Created Successfully", data: populatedData });
    }).catch((error) => {
        res.status(200).json({ error: error.message });
    });
}

module.exports.getManagers = async (req, res) => {
    if (req.user.adminData) {
        const managers = await managerSchema.find({ adminId: req.user.adminData._id });
        res.status(200).json({ managers });
    } else {
        res.status(403).json({ message: "Unauthorized access" });
    }
}

module.exports.employeeLogin = async (req, res) => {
    let employee = await employeeSchema.findOne({ email: req.body.email });

    if (!employee) {
        return res.status(404).json({ message: "Employee Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, employee.password)) {
        let token = jwt.sign({ employeeData: employee }, "employee000", { expiresIn: "1h" });
        res.status(200).json({ message: "Employee Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
};

module.exports.deleteEmployee = async (req, res) => {
    const data = await employeeSchema.findByIdAndDelete(req.query.id);
    if (!data) {
        return res.status(404).json({ message: "Employee not found" });
    }
    if (data.image && fs.existsSync(data.image)) {
        fs.unlinkSync(data.image);
    }
    res.status(200).json({ message: "This Employee is Deleted", data });
};

module.exports.updateEmployee = async (req, res) => {
    const employee = await employeeSchema.findById(req.query.id);
    if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
    }

    if (!req.file) {
        req.body.image = employee.image;
    } else {
        if (fs.existsSync(employee.image)) {
            fs.unlinkSync(employee.image);
        }
        req.body.image = req.file.path;
    }

    const data = await employeeSchema.findByIdAndUpdate(req.query.id, req.body, { new: true });
    res.status(200).json({ message: "Employee is Updated", data });
}

module.exports.employeeProfile = async (req, res) => {
    let profile = await employeeSchema.findById(req.user.employeeData._id);
    if (!profile) {
        return res.status(404).json({ message: "Employee Not Found" });
    }
    res.status(200).json({ message: "Employee Profile", data: profile });
}

module.exports.employeeChangePassword = async (req, res) => {
    let employee = await employeeSchema.findById(req.user.employeeData._id);
    if (!employee) {
        return res.status(404).json({ message: "Employee Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, employee.password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }
    
    employee.password = await bcryptjs.hash(req.body.newPassword, 10);
    await employee.save();
    res.status(200).json({ message: "Password changed successfully" });
}

// module.exports.forgotPassword = async (req, res) => {
//     let employee = await employeeSchema.findOne({ email: req.body.email });
//     if (!employee) {
//         return res.status(404).json({ message: "Employee Not Found" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     employee.resetOtp = otp;
//     await employee.save();

//     sendOtp(employee.email, otp);
//     res.status(200).json({ message: "OTP sent to email" });
// }

// module.exports.resetPassword = async (req, res) => {
//     let employee = await employeeSchema.findOne({ email: req.body.email, resetOtp: req.body.otp });
//     if (!employee) {
//         return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (req.body.newPassword !== req.body.confirmPassword) {
//         return res.status(400).json({ message: "New Password and Confirm Password do not match" });
//     }

//     employee.password = await bcryptjs.hash(req.body.newPassword, 10);
//     await employee.save();

//     res.status(200).json({ message: "Password reset successfully" });
// }
