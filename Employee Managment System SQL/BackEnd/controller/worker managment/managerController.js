const pool = require('../../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');

module.exports.managerList = async (req, res) => {
    if (req.user.adminData) {
        const adminData = req.user.adminData;
        await pool.query('SELECT * FROM managers WHERE adminId = $1', [adminData.id]).then((data) => {
            res.status(200).json({ message: "All Manager Data", managerData: data.rows });
        }) 
    } else if (req.user.managerData) {
        await pool.query('SELECT * FROM managers').then((data) => {
            res.status(200).json({ message: "All Manager Data", managerData: data.rows });
        }).catch((err) => {
            res.status(500).json({ message: "You Are Not Eligible To see Data", err });
        });
    } else {
        res.status(500).json({ message: "You Are Not Eligible To see Data"});
    }
}

module.exports.managerRegister = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    req.body.image = req.file.path;
    req.body.password = await bcryptjs.hash(req.body.password, 10);
    req.body.adminId = req.user.adminData.id;
    await pool.query('INSERT INTO managers (name, email, phone, password, image, gender, salary, role, adminId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', 
    [req.body.name, req.body.email, req.body.phone, req.body.password, req.body.image, req.body.gender, req.body.salary, req.body.role, req.body.adminId])
    .then(async (data) => {
        res.status(200).json({ message: "Manager Created Successfully", data: data.rows[0] });
    }).catch((error) => {
        res.status(200).json({ error: error.message });
    });
}

module.exports.managerLogin = async (req, res) => {
    let manager = await pool.query('SELECT * FROM managers WHERE email = $1', [req.body.email]);

    if (!manager.rows.length) {
        return res.status(404).json({ message: "Manager Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, manager.rows[0].password)) {
        let token = jwt.sign({ managerData: manager.rows[0] }, "employee000", { expiresIn: "24h" });
        res.status(200).json({ message: "Manager Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
}

module.exports.deleteManager = async (req, res) => {
    try {
        const data = await pool.query('DELETE FROM managers WHERE id = $1 RETURNING *', [req.query.id]);
        if (!data.rows.length) {
            return res.status(404).json({ message: "Manager not found" });
        }
        if (data.rows[0].image && fs.existsSync(data.rows[0].image)) {
            fs.unlinkSync(data.rows[0].image);
        }
        res.status(200).json({ message: "This Manager is Deleted", data: data.rows[0] });
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ message: "Can't delete manager because they have associated employees or projects." });
        }
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

module.exports.updateManager = async (req, res) => {
    const manager = await pool.query('SELECT * FROM managers WHERE id = $1', [req.query.id]);
    if (!manager.rows.length) {
        return res.status(404).json({ message: "Manager not found" });
    }

    if(req.user.adminData){
        const updatedFields = {
            name: req.body.name || manager.rows[0].name,
            email: req.body.email || manager.rows[0].email,
            phone: req.body.phone || manager.rows[0].phone,
            password: req.body.password ? await bcryptjs.hash(req.body.password, 10) : manager.rows[0].password,
            image: req.file ? req.file.path : manager.rows[0].image,
            gender: req.body.gender || manager.rows[0].gender,
            salary: req.body.salary || manager.rows[0].salary,
            role: req.body.role || manager.rows[0].role,
            adminId: req.user.adminData.id,
        };
        const data = await pool.query('UPDATE managers SET name = $1, email = $2, phone = $3, password = $4, image = $5, gender = $6, salary = $7, role = $8, adminId = $9 WHERE id = $10 RETURNING *', 
            [updatedFields.name, updatedFields.email, updatedFields.phone, updatedFields.password, updatedFields.image, updatedFields.gender, updatedFields.salary, updatedFields.role, updatedFields.adminId, req.query.id]);
        
            res.status(200).json({ message: "Manager is Updated", data: data.rows[0] });
    }else{
        const adminid = manager.rows[0].adminid
        const updatedFields = {
            name: req.body.name || manager.rows[0].name,
            email: req.body.email || manager.rows[0].email,
            phone: req.body.phone || manager.rows[0].phone,
            password: manager.rows[0].password,
            image: req.file ? req.file.path : manager.rows[0].image,
            gender: req.body.gender || manager.rows[0].gender,
            salary: req.body.salary || manager.rows[0].salary,
            role: req.body.role || manager.rows[0].role,
            adminId: adminid,
        };
        const data = await pool.query('UPDATE managers SET name = $1, email = $2, phone = $3, password = $4, image = $5, gender = $6, salary = $7, role = $8, adminId = $9 WHERE id = $10 RETURNING *', 
            [updatedFields.name, updatedFields.email, updatedFields.phone, updatedFields.password, updatedFields.image, updatedFields.gender, updatedFields.salary, updatedFields.role, updatedFields.adminId, req.query.id]);
        
            res.status(200).json({ message: "Manager is Updated", data: data.rows[0] });
    }
}

module.exports.managerProfile = async (req, res) => {
    let profile = await pool.query('SELECT * FROM managers WHERE id = $1', [req.user.managerData.id]);
    if (!profile.rows.length) {
        return res.status(404).json({ message: "Manager Not Found" });
    }
    res.status(200).json({ message: "Manager Profile", data: profile.rows[0] });
}

module.exports.managerChangePassword = async (req, res) => {
    let manager = await pool.query('SELECT * FROM managers WHERE id = $1', [req.user.managerData.id]);
    if (!manager.rows.length) {
        return res.status(404).json({ message: "Manager Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, manager.rows[0].password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    const newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await pool.query('UPDATE managers SET password = $1 WHERE id = $2', [newPassword, req.user.managerData.id]);
    res.status(200).json({ message: "Password changed successfully" });
}

