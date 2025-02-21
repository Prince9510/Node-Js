const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    managerName: {
        type: String,
        required: true
    },
    managerEmail: {
        type: String,
        required: true
    },
    managerPhone: {
        type: Number,
        required: true
    },
    managerPassword: {
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
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin_Detail',
        required: true
    }
});

const managerSchema = mongoose.model('manager_Detail', schema);

module.exports = managerSchema;