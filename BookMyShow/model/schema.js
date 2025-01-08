const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
});

const movie = mongoose.model("Book_My_Show_Data", schema);

module.exports = movie;
