const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true
    },
    employeeEmail: {
        type: String,
        required: true
    },
    employeePhone: {
        type: Number,
        required: true
    },
    employeePassword: {
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
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manager_Detail',
        required: true
    }
});

const employeeSchema = mongoose.model('employee_Detail', schema);

module.exports = employeeSchema;