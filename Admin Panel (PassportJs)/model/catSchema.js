const mongoose = require ("mongoose");
const schema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
    },
    image :{
        type : String,
        required : true
    },
})

const AdminCategory = mongoose.model('Categorie',schema);

module.exports = AdminCategory;