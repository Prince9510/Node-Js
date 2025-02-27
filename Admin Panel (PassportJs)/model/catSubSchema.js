const mongoose = require ("mongoose");
const schema = new mongoose.Schema({
    catSubName:{
        type:String,
        required:true,
    },
    categoryId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Categorie",
        required : true
    },
})

const AdminSubCategory = mongoose.model('SubCategorie',schema);

module.exports = AdminSubCategory;