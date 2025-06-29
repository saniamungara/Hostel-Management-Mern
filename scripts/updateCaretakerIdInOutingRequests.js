/**
 * This script updates all outing requests in the MongoDB database
 * to set the caretakerId field if it is missing or incorrect.
 * 
 * Usage:
 * 1. Replace 'ACTUAL_CARETAKER_ID' with the actual caretakerId value.
 * 2. Run this script with Node.js in the project root:
 *    node scripts/updateCaretakerIdInOutingRequests.js
 */

const mongoose = require('mongoose');
const OutingStudentModel = require('../server/models/OutingStudent');

const MONGODB_URI = 'mongodb://localhost:27017/employee'; // Adjust if needed
const CORRECT_CARETAKER_ID = 'admin123'; // Updated with actual caretakerId

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

async function updateCaretakerIds() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Wait for 3 seconds before querying to ensure connection stability
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Connected to MongoDB');

    console.log('Starting to find outing requests needing update...');
    const docs = await OutingStudentModel.find({
      $or: [
        { caretakerId: { $exists: false } },
        { caretakerId: { $ne: CORRECT_CARETAKER_ID } }
      ]
    });
    console.log(`Found ${docs.length} outing requests needing update.`);

    for (const doc of docs) {
      doc.caretakerId = CORRECT_CARETAKER_ID;
      await doc.save();
      console.log(`Updated document with _id: ${doc._id}`);
    }

    console.log(`Total documents updated: ${docs.length}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating caretakerId in outing requests:', error);
  }
}

updateCaretakerIds();
