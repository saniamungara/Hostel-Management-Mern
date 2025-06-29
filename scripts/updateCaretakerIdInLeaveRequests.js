const mongoose = require('mongoose');
const LeaveRequestModel = require('../server/models/LeaveRequest');

const MONGODB_URI = 'mongodb://localhost:27017/employee'; // Use your actual MongoDB URI

const ADMIN_CARETAKER_ID = 'admin123'; // Use admin123 as caretakerId as requested

async function updateLeaveRequestsCaretakerId() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const leaveRequests = await LeaveRequestModel.find({
      $or: [
        { caretakerId: { $exists: false } },
        { caretakerId: { $eq: null } },
        { caretakerId: '' }
      ]
    });

    for (const leaveRequest of leaveRequests) {
      leaveRequest.caretakerId = ADMIN_CARETAKER_ID;
      await leaveRequest.save();
      console.log(`Updated leave request ${leaveRequest._id} with caretakerId ${ADMIN_CARETAKER_ID}`);
    }

    console.log('CaretakerId update for leave requests completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating caretakerId in leave requests:', error);
    process.exit(1);
  }
}

updateLeaveRequestsCaretakerId();
