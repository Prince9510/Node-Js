const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
    },
    prefer: {
        type: Array,
        required: true,
    }, 
    user_id:{
        type:String,
        required:true
    }
})

const Admin = mongoose.model("user-schema",schema)

module.exports = Admin