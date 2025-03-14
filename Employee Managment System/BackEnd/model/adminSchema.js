const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
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

module.exports = mongoose.model('admin_Detail', adminSchema);
