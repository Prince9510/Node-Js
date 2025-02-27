const mongoose = require ("mongoose");
mongoose.connect('mongodb+srv://satasiyaprince9510:8160636847@free.t64lj.mongodb.net/?retryWrites=true&w=majority&appName=ADMIN');
const db = mongoose.connection;
db.once("open",(err)=>{
    err?console.log(err):console.log("Connected to MongoDB");    
})

module.exports = db;
