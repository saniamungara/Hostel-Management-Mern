const mongoose = require('mongoose');
const CaretakerModel = require('./models/Caretaker');

mongoose.connect('mongodb://localhost:27017/employee', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB for caretaker seeding');

  // Check if caretaker already exists
  const existingCaretaker = await CaretakerModel.findOne({ ctId: 'admin123' });
  if (existingCaretaker) {
    console.log('Caretaker with ctId "admin123" already exists.');
  } else {
    // Create new caretaker
    const caretaker = new CaretakerModel({
      ctId: 'admin123',
      password: 'admin123',
    });

    await caretaker.save();
    console.log('Caretaker "admin123" created successfully.');
  }

  mongoose.disconnect();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
