const mongoose = require('mongoose');

const LeaveAcceptedStudentSchema = new mongoose.Schema({
  idNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  leaveStart: { type: Date, required: true },
  leaveEnd: { type: Date, required: true },
  studentPhone: { type: String, required: true },
  parentPhone: { type: String, required: true },
  reason: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  caretakerId: { type: String }
});

module.exports = mongoose.model('LeaveAcceptedStudent', LeaveAcceptedStudentSchema);
