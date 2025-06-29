const mongoose = require('mongoose');

const outingAcceptedStudentSchema = new mongoose.Schema({
    idNumber: String,
    name: String,
    outingTime: Date,
    reportingTime: Date,
    studentPhone: String,
    parentPhone: String,
    reason: String,
    submittedAt: Date,
    email: String   
});

module.exports = mongoose.model('OutingAcceptedStudent', outingAcceptedStudentSchema);
