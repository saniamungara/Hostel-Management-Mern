const mongoose = require('mongoose');
const EmployeeModel = require('../server/models/Employee');

const MONGODB_URI = 'mongodb://localhost:27017/employee'; // Use your actual MongoDB URI

const ADMIN_CARETAKER_ID = 'adminCaretakerId123'; // Replace with actual admin caretakerId

async function updateCaretakerIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const employees = await EmployeeModel.find({});
    for (const employee of employees) {
      employee.caretakerId = ADMIN_CARETAKER_ID;
      await employee.save();
      console.log(`Updated employee ${employee._id} with caretakerId ${ADMIN_CARETAKER_ID}`);
    }

    console.log('CaretakerId update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating caretakerId:', error);
    process.exit(1);
  }
}

updateCaretakerIds();
