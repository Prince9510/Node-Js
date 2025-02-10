const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    adminEmail: {
        type: String,
        required: true,
        unique: true
    },
    adminMobile: {
        type: Number,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    adminPicture: {
        type: String,
        required: true
    },
    adminGender: {
        type: String,
        required: true
    }
});

const adminSchema = mongoose.model('adminDetail', schema);

module.exports = adminSchema;

