const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
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
    gender: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'E'
    },
    resetOtp: {
        type: String,
        required: false
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin_Detail',
        required: false
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manager_Detail',
        required: true
    }
});

module.exports = mongoose.model('employee_Detail', employeeSchema);