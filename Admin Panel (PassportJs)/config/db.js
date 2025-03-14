const mongoose = require ("mongoose");
mongoose.connect('mongodb+srv://satasiyaprince9510:<db_password>@free.t64lj.mongodb.net/?retryWrites=true&w=majority&appName=NEW_ADMIN');
const db = mongoose.connection;
db.once("open",(err)=>{
    err?console.log(err):console.log("Connected to MongoDB");    
})

module.exports = db;
