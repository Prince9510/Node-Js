const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/New_Admin_Panel_Scratch");

const dataBase = mongoose.connection;
dataBase.once("opne",(err)=>{
    err ? console.log(err) : console.log("Database Connected");
})

module.exports = dataBase;