const jwt = require("jsonwebtoken");

const Userauth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized User" });
    }
    try {
        const decoded = jwt.verify(token, "karan");
        req.user = decoded.userData; 
        next();
    } catch (err) {
        res.status(403).json({ msg: "Invalid token" });
    }
};

module.exports = Userauth;
