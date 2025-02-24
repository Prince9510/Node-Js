const Schema = require("../model/Schema");
const Admin = require("../model/adminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.Register = (req, res) => {
    res.render("register");
};

module.exports.SignUpData = async (req, res) => {
    const user = await Admin.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ msg: "User already exists" });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    await Admin.create(req.body).then(() => res.redirect("/login"));
};

module.exports.Login = (req, res) => {
    res.render("login");
};

module.exports.LoginData = async (req, res) => {
    const user = await Admin.findOne({ email: req.body.email });
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        const token = jwt.sign({ userData: user }, "karan", { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/navbar");
    } else {
        res.status(400).json({ msg: "Invalid credentials" });
    }
};

module.exports.Logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};


module.exports.Navbar = (req, res) => {
    res.render("navbar");
};


module.exports.taskform = (req, res) => {
    res.render("taskform");
};


module.exports.tasklist = async (req, res) => {
    await Schema.find({ user_id: req.user._id }).then((data) => {
        res.render("tasklist", { data });
    });
};


module.exports.addData = async (req, res) => {
    const task = { ...req.body, user_id: req.user._id };
    await Schema.create(task).then(() => res.redirect("/tasklist"));
};


module.exports.deleteData = async (req, res) => {
    await Schema.findOneAndDelete({ _id: req.query.id, user_id: req.user._id }).then(() =>
        res.redirect("/tasklist")
    );
};


module.exports.EditData = async (req, res) => {
    await Schema.findOne({ _id: req.query.id, user_id: req.user._id }).then((user) => {
        res.render("edit", { user });
    });
};


module.exports.UpdateData = async (req, res) => {
    await Schema.findOneAndUpdate(
        { _id: req.body.id, user_id: req.user._id },
        req.body
    ).then(() => res.redirect("/tasklist"));
};
