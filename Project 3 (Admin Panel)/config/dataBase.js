const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/New_Admin_Panel');
const dataBase = mongoose.connection;

dataBase.once("open" , (err)=>{
    err?console.log(err):console.log("Connected to MongoDB");    
})

module.exports = dataBase;
