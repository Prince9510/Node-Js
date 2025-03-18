const pool = require('../../config/db');
const bcryptjs = require('bcryptjs');
const { sendOtp } = require('../../middleware/mailer');

async function getUserByEmail(email) {
    let user = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (user.rows.length) return { user: user.rows[0], table: 'admins' };

    user = await pool.query('SELECT * FROM managers WHERE email = $1', [email]);
    if (user.rows.length) return { user: user.rows[0], table: 'managers' };

    user = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
    if (user.rows.length) return { user: user.rows[0], table: 'employees' };

    return null;
}

module.exports.forgotPassword = async (req, res) => {
    const userResult = await getUserByEmail(req.body.email);
    if (!userResult) {
        return res.status(404).json({ message: "User Not Found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await pool.query(`UPDATE ${userResult.table} SET resetOtp = $1 WHERE email = $2`, [otp, req.body.email]);

    sendOtp(userResult.user.email, otp);
    // console.log('otp old ' + otp)
    res.status(200).json({ message: "OTP sent to email" });
}

module.exports.resetPassword = async (req, res) => {
    const userResult = await getUserByEmail(req.body.email);
    // console.log(req.body.otp)
    if (!userResult) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ message: "New Password and Confirm Password do not match" });
    }

    const newPassword = await bcryptjs.hash(req.body.newPassword, 10);
    await pool.query(`UPDATE ${userResult.table} SET password = $1 WHERE email = $2`, [newPassword, req.body.email]);

    res.status(200).json({ message: "Password reset successfully" });
}
