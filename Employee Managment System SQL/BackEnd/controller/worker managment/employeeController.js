const pool = require('../../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');

module.exports.employeeList = async (req, res) => {
    if (req.user.adminData) {
        const adminData = req.user.adminData;
        const managerData = await pool.query('SELECT * FROM managers WHERE adminId = $1', [adminData.id]);

        const employeeData = await pool.query('SELECT * FROM employees WHERE managerId = ANY($1)', [managerData.rows.map(m => m.id)]);

        res.status(200).json({ message: "All Manager Data", managerData: managerData.rows, employeeData: employeeData.rows });
    } else if (req.user.managerData) {
        const managerData = req.user.managerData;
        const employeeData = await pool.query('SELECT * FROM employees WHERE managerId = $1', [managerData.id]);

        res.status(200).json({ message: "All Employee Data", managerData, employeeData: employeeData.rows });

    } else if (req.user.employeeData) {
        const employeeData = await pool.query('SELECT * FROM employees WHERE managerId = $1', [req.user.employeeData.managerid]);
        res.status(200).json({ message: "All Employee Data", employeeData: employeeData.rows });

    } else {
        res.status(200).json({ message: "unauthorized user" });
    }
}

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
        req.body.managerId = parseInt(req.user.managerData.id, 10);
        const managerId = parseInt(req.body.managerId, 10);
        const manager = await pool.query('SELECT * FROM managers WHERE id = $1', [managerId]);
        if (!manager.rows.length) {
            return res.status(404).json({ message: "Manager not found" });
        }

        req.body.adminId = manager.rows[0].adminid;

    } else if (req.user.adminData) {
        if (!req.body.managerId) {
            return res.status(400).json({ message: "Manager ID is required when admin is adding an employee" });
        }
        const managerId = parseInt(req.body.managerId, 10);

        // console.log(managerId)
        
        req.body.adminId = parseInt(req.user.adminData.id, 10);
        req.body.managerId = managerId;
    }

    await pool.query('INSERT INTO employees (name, email, phone, password, image, gender, salary, role, adminId, managerId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
    [req.body.name, req.body.email, req.body.phone, req.body.password, req.body.image, req.body.gender, req.body.salary, req.body.role, req.body.adminId, req.body.managerId])
    .then(async (data) => {
        res.status(200).json({ message: "Employee Created Successfully", data: data.rows[0] });
    }).catch((error) => {
        res.status(200).json({ error: error.message });
    });
}

module.exports.getManagers = async (req, res) => {
    if (req.user.adminData) {
        const managers = await pool.query('SELECT * FROM managers WHERE adminId = $1', [req.user.adminData.id]);
        res.status(200).json({ managers: managers.rows });
    } else {
        res.status(200).json({ message: "Unauthorized access" });
    }
}

module.exports.employeeLogin = async (req, res) => {
    let employee = await pool.query('SELECT * FROM employees WHERE email = $1', [req.body.email]);

    if (!employee.rows.length) {
        return res.status(404).json({ message: "Employee Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, employee.rows[0].password)) {
        let token = jwt.sign({ employeeData: employee.rows[0] }, "employee000", { expiresIn: "24h" });
        res.status(200).json({ message: "Employee Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
};

module.exports.deleteEmployee = async (req, res) => {
    try {
        const data = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [req.query.id]);
        if (!data.rows.length) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (data.rows[0].image && fs.existsSync(data.rows[0].image)) {
            fs.unlinkSync(data.rows[0].image);
        }
        res.status(200).json({ message: "This Employee is Deleted", data: data.rows[0] });
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation
            return res.status(400).json({ message: "Can't delete user because they have associated projects." });
        }
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

module.exports.updateEmployee = async (req, res) => {
    const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [req.query.id]);
    if (!employee.rows.length) {
        return res.status(404).json({ message: "Employee not found" });
    }


    const updatedFields = {
        name: req.body.name || employee.rows[0].name,
        email: req.body.email || employee.rows[0].email,
        phone: req.body.phone || employee.rows[0].phone,
        password: employee.rows[0].password,
        image: req.file ? req.file.path : employee.rows[0].image,
        gender: req.body.gender || employee.rows[0].gender,
        salary: req.body.salary || employee.rows[0].salary,
        role: req.body.role || employee.rows[0].role,
        adminId: req.body.adminid || employee.rows[0].adminid,
        managerId: req.body.managerid || employee.rows[0].managerid,
    };

    const data = await pool.query('UPDATE employees SET name = $1, email = $2, phone = $3, password = $4, image = $5, gender = $6, salary = $7, role = $8, adminId = $9, managerId = $10 WHERE id = $11 RETURNING *', 
    [updatedFields.name, updatedFields.email, updatedFields.phone, updatedFields.password, updatedFields.image, updatedFields.gender, updatedFields.salary, updatedFields.role, updatedFields.adminId, updatedFields.managerId, req.query.id]);

    res.status(200).json({ message: "Employee is Updated", data: data.rows[0] });
}

module.exports.employeeProfile = async (req, res) => {
    let profile = await pool.query('SELECT * FROM employees WHERE id = $1', [req.user.employeeData.id]);
    if (!profile.rows.length) {
        return res.status(404).json({ message: "Employee Not Found" });
    }
    res.status(200).json({ message: "Employee Profile", data: profile.rows[0] });
}

module.exports.employeeChangePassword = async (req, res) => {
    let employee = await pool.query('SELECT * FROM employees WHERE id = $1', [req.user.employeeData.id]);
    if (!employee.rows.length) {
        return res.status(404).json({ message: "Employee Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, employee.rows[0].password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }
    
    const newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await pool.query('UPDATE employees SET password = $1 WHERE id = $2', [newPassword, req.user.employeeData.id]);
    res.status(200).json({ message: "Password changed successfully" });
}
