const pool = require('../config/db');

const checkAdminOrManager = async (req, res, next) => {
    if (req.user && req.user.adminData) {
        const admin = await pool.query('SELECT * FROM admins WHERE id = $1', [req.user.adminData.id]);
        if (admin.rows.length) {
            return next();
        }
    }

    if (req.user && req.user.managerData) {
        const manager = await pool.query('SELECT * FROM managers WHERE id = $1', [req.user.managerData.id]);
        if (manager.rows.length) {
            return next();
        }
    }

    return res.status(403).json({ message: "Access denied. Admin or Manager only." });
}

module.exports = checkAdminOrManager;
