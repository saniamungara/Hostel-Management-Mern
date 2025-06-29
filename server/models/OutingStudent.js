const mongoose = require('mongoose');

const outingStudentSchema = new mongoose.Schema({
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

module.exports = mongoose.model('OutingStudent', outingStudentSchema);
