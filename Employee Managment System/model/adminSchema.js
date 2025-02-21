const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    adminEmail: {
        type: String,
        required: true
    },
    adminPhone: {
        type: Number,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    resetOtp: {
        type: String,
        required: false
    }
});

const adminSchema = mongoose.model('admin_Detail', schema);

module.exports = adminSchema;