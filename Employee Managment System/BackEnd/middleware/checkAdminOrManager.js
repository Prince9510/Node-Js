const adminSchema = require('../model/adminSchema');
const managerSchema = require('../model/managerSchema');

const checkAdminOrManager = async (req, res, next) => {
    if (req.user && req.user.adminData) {
        const admin = await adminSchema.findById(req.user.adminData._id);
        if (admin) {
            return next();
        }
    }

    if (req.user && req.user.managerData) {
        const manager = await managerSchema.findById(req.user.managerData._id);
        if (manager) {
            return next();
        }
    }

    return res.status(403).json({ message: "Access denied. Admin or Manager only." });
}

module.exports = checkAdminOrManager;
