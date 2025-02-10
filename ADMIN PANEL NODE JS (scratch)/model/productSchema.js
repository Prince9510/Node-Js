const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategories",
        required: true
    },
    productImage: {
        type: String,
        required: true,
    },
});

const productSchema = mongoose.model('product', schema);

module.exports = productSchema;

