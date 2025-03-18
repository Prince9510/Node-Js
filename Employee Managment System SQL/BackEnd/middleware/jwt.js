const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Token Not Found" });
    }

    let newToken = token.slice(7, token.length);
    try {
        let decode = jwt.verify(newToken, "employee000");
        req.user = decode;
        // console.log("Decoded token:", decode); // Add logging
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token", error });
    }
};

module.exports = authentication;