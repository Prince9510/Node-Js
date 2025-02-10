const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true
    },
    subCategoryImage: {
        type: String,
        required: true,
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "categories",
        required : true
    },
});

const subCategorySchema = mongoose.model('subCategories', schema);

module.exports = subCategorySchema;

