const pool = require('../../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtp } = require('../../middleware/mailer');
const fs = require('fs');

module.exports.adminList = async (req, res) => {
    await pool.query('SELECT * FROM admins').then((data) => {
        res.status(200).json({ message: "All Admin Data", data: data.rows });
    });
}

module.exports.adminRegister = async (req, res) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    req.body.image = req.file.path;
    req.body.password = await bcryptjs.hash(req.body.password, 10);
    await pool.query('INSERT INTO admins (name, email, phone, password, image, role, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
    [req.body.name, req.body.email, req.body.phone, req.body.password, req.body.image, req.body.role, req.body.gender])
    .then((data) => {
        const token = jwt.sign({ adminData: data.rows[0] }, "employee000", { expiresIn: "24h" });
        res.status(200).json({ message: "Admin Created Successfully", token: token, data: data.rows[0] });
    }).catch((error) => {
        res.status(200).json({ error: error.message });
    });
}

module.exports.adminLogin = async (req, res) => {
    let admin = await pool.query('SELECT * FROM admins WHERE email = $1', [req.body.email]);

    if (!admin.rows.length) {
        return res.status(404).json({ message: "Admin Not Found" });
    }
    if (await bcryptjs.compare(req.body.password, admin.rows[0].password)) {
        let token = jwt.sign({ adminData: admin.rows[0] }, "employee000", { expiresIn: "24h" });
        res.status(200).json({ message: "Admin Log In", token: token });
    } else {
        res.status(400).json({ message: "Password is wrong" });
    }
}

module.exports.deleteAdmin = async (req, res) => {
    const data = await pool.query('DELETE FROM admins WHERE id = $1 RETURNING *', [req.query.id]);
    if (!data.rows.length) {
        return res.status(404).json({ message: "Admin not found" });
    }
    if (data.rows[0].image && fs.existsSync(data.rows[0].image)) {
        fs.unlinkSync(data.rows[0].image);
    }
    res.status(200).json({ message: "This Admin Are Deleted", data: data.rows[0] });
}

module.exports.updateAdmin = async (req, res) => {
    const boolean = req.user.adminData.id != req.query.id;

    if (req.user.adminData.id != req.query.id) {
        return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    if (req.body.password) {
        req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const existingAdmin = await pool.query('SELECT * FROM admins WHERE id = $1', [req.query.id]);
    if (!existingAdmin.rows.length) {
        return res.status(404).json({ message: "Admin not found" });
    }

    const updatedFields = {
        name: req.body.name || existingAdmin.rows[0].name,
        email: req.body.email || existingAdmin.rows[0].email,
        phone: req.body.phone || existingAdmin.rows[0].phone,
        password: req.body.password || existingAdmin.rows[0].password,
        image: req.file ? req.file.path : existingAdmin.rows[0].image,
        role: req.body.role || existingAdmin.rows[0].role,
        gender: req.body.gender || existingAdmin.rows[0].gender,
    };

    try {
        const data = await pool.query('UPDATE admins SET name = $1, email = $2, phone = $3, password = $4, image = $5, role = $6, gender = $7 WHERE id = $8 RETURNING *', 
        [updatedFields.name, updatedFields.email, updatedFields.phone, updatedFields.password, updatedFields.image, updatedFields.role, updatedFields.gender, req.query.id]);
        if (!data.rows.length) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin is Updated", data: data.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
}

module.exports.adminProfile = async (req, res) => {
    let profile = await pool.query('SELECT * FROM admins WHERE id = $1', [req.user.adminData.id]);
    if (!profile.rows.length) {
        return res.status(404).json({ message: "Admin Not Found" });
    }
    res.status(200).json({ message: "Admin Profile", data: profile.rows[0] });
}

module.exports.adminChangePassword = async (req, res) => {
    let admin = await pool.query('SELECT * FROM admins WHERE id = $1', [req.user.adminData.id]);
    if (!admin.rows.length) {
        return res.status(404).json({ message: "Admin Not Found" });
    }

    const compare = await bcryptjs.compare(req.body.oldPassword, admin.rows[0].password);
    if (!compare) {
        return res.status(400).json({ message: "Old Password is incorrect" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }
    const newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [newPassword, req.user.adminData.id]);
    res.status(200).json({ message: "Password changed successfully" });
}


module.exports.forceDeleteManager = async (req, res) => {
    const managerId = req.query.id; 

    try {
        let adminCheck = await pool.query('SELECT role FROM admins WHERE id = $1', [req.user.adminData.id]);
        if (!adminCheck.rows.length || adminCheck.rows[0].role !== 'admin') {
            return res.status(403).json({ message: "Only admins can perform this action" });
        }

        await pool.query('BEGIN');

        await pool.query(`DELETE FROM projects WHERE assigneToManager = $1OR assigneByManager = $1`, [managerId]);

        let employees = await pool.query(`SELECT id FROM employees WHERE managerId = $1`, [managerId]);

        if (employees.rows.length > 0) {
            const employeeIds = employees.rows.map(emp => emp.id);
            await pool.query(`DELETE FROM projects WHERE assigneToEmployee = ANY($1)`, [employeeIds]);
            
            await pool.query(`DELETE FROM employees WHERE managerId = $1`, [managerId]);
        }

        let managerData = await pool.query('SELECT image FROM managers WHERE id = $1', [managerId]);
        if (managerData.rows.length && managerData.rows[0].image && fs.existsSync(managerData.rows[0].image)) {
            fs.unlinkSync(managerData.rows[0].image);
        }

        let deletedManager = await pool.query(`DELETE FROM managers WHERE id = $1 RETURNING *`, [managerId]);

        if (!deletedManager.rows.length) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Manager not found" });
        }

        await pool.query('COMMIT');
        res.status(200).json({ 
            message: "Manager and all related data deleted successfully", 
            data: deletedManager.rows[0] 
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ 
            message: "Failed to delete manager and related data", 
            error: error.message 
        });
    }
}

module.exports.forceDeleteEmployee = async (req, res) => {
    const employeeId = req.query.id; 
    try {
        let adminCheck = await pool.query('SELECT role FROM admins WHERE id = $1', [req.user.adminData.id]);
        if (!adminCheck.rows.length || adminCheck.rows[0].role !== 'admin') {
            return res.status(403).json({ message: "Only admins can perform this action" });
        }

        await pool.query('BEGIN');

        await pool.query(`DELETE FROM projects WHERE assigneToEmployee = $1`, [employeeId]);

        let employeeData = await pool.query('SELECT image FROM employees WHERE id = $1', [employeeId]);
        if (employeeData.rows.length && employeeData.rows[0].image && fs.existsSync(employeeData.rows[0].image)) {
            fs.unlinkSync(employeeData.rows[0].image);
        }

        let deletedEmployee = await pool.query(`DELETE FROM employees WHERE id = $1 RETURNING *`, [employeeId]);

        if (!deletedEmployee.rows.length) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: "Employee not found" });
        }

        await pool.query('COMMIT');
        res.status(200).json({ 
            message: "Employee and related data deleted successfully", 
            data: deletedEmployee.rows[0] 
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        res.status(500).json({ 
            message: "Failed to delete employee and related data", 
            error: error.message 
        });
    }
}