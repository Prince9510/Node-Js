const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    assigneTo: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'assigneToRole'
    },
    priority: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    assigneBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin_Detail' || 'manager_Detail'
    },
    assigneToRole: {
        type: String,
        enum: ['manager', 'employee'],
        required: true
    }
});

const projectSchema = mongoose.model('projects', schema);

module.exports = projectSchema;