const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Employee_Managment_System');
const db = mongoose.connection;

db.once("open",(err)=>{
    err?console.log(err):console.log("Connected to MongoDB");
})

module.exports = db;