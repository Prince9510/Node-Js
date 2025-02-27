const mongoose = require ("mongoose");
const schema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    productPrice :{
        type : String,
        required : true
    },
    productDescription :{
        type : String,
        required : true
    },
    image :{
        type : String,
        required : true
    },
    subCategoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SubCategorie',
        required : true
    },
    extraSubCategoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ExtraSubCategorie',
        required : true
    }
})

const productSchema = mongoose.model('productSchema',schema);

module.exports = productSchema;