const mongoose = require ("mongoose");
const schema = new mongoose.Schema({
    fristName:{
        type:String,
        required:true,
    },
    lastName :{
        type : String,
        required : true
    },
    passWord :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    contactNo :{
        type : Number,
        required : true
    },
    gender :{
        type : String,
        required : true
    },
    permission :{
        type : [String],
        required : true
    },
    image:{
        type:String,
        required:true,
    },
    message :{
        type : String,
        required : true
    }
    
})

const Admin = mongoose.model('AdminPanel_Passport',schema);

module.exports = Admin;