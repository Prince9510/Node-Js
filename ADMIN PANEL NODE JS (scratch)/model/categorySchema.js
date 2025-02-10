const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true,
    },
});

const categorySchema = mongoose.model('categories', schema);

module.exports = categorySchema;

