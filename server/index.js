require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const EmployeeModel = require('./models/Employee');
const OutingStudentModel = require('./models/OutingStudent');
const CaretakerModel = require('./models/Caretaker');
const OutingAcceptedStudentModel = require('./models/OutingAcceptedStudent');
const LeaveRequestModel = require('./models/LeaveRequest');
const LeaveAcceptedStudentModel = require('./models/LeaveAcceptedStudent');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const emailPattern = /^[a-zA-Z0-9._%+-]+@rcee\.ac\.in$/i;
const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'saniamungara@gmail.com',
        pass: 'xcsf mvgu cnvz bupy'
    }
});

app.post('/send-otp', (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received /send-otp request:", { name, email, password });
    if (!emailPattern.test(email)) {
        console.log("Invalid email format:", email);
        return res.json("invalid");
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = { otp, name, password };
    console.log(`Generated OTP for ${email}: ${otp}`);

    const mailOptions = {
        from: 'saniamungara@gmail.com',
        to: email,
        subject: 'Your OTP for Registration',
        text: `Ramachandra College of Engineering Hostel Management\n\nHi ${name},\n\nYour OTP is: ${otp}\n\nUse this to complete your registration.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending OTP email:", error);
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        console.log("OTP email sent:", info.response);
        return res.json("otp_sent");
    });
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) return res.status(400).json("otp_expired");
    if (record.otp !== otp) return res.status(401).json("otp_invalid");

    try {
        const existingUser = await EmployeeModel.findOne({ email });
        if (existingUser) return res.status(409).json("email_exists");

        const { name, password } = record;
        await EmployeeModel.create({ name, email, password });
        delete otpStore[email];
        res.json("verified");
    } catch (err) {
        res.status(500).json("registration_failed");
    }
});

app.post('/sendotp', async (req, res) => {
    const { email } = req.body;
    if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: "Invalid RGUKT email format" });

    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email not registered" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 300000 };

    const mailOptions = {
        from: 'saniamungara@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Ramachandra College of Engineering Hostel Management\n\nYour password reset OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ success: false, message: "Failed to send OTP" });
        res.json({ success: true, message: "OTP sent" });
    });
});

app.post('/verifyotp', async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });
    if (!record) return res.status(400).json({ success: false, message: "OTP expired or not found" });
    if (record.otp !== otp) return res.status(401).json({ success: false, message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) {
        delete otpStore[email];
        return res.status(400).json({ success: false, message: "OTP expired" });
    }
    delete otpStore[email];
    res.json({ success: true, message: "Registration successful" });
});

app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const result = await EmployeeModel.updateOne({ email }, { $set: { password: newPassword } });
    if (result.modifiedCount === 1) return res.json({ success: true });
    res.json({ success: false, message: 'Password update failed' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email });
        if (!user) return res.json("no_email");
        if (user.password !== password) return res.json("wrong_password");
        console.log('Backend login: caretakerId for user', email, ':', user.caretakerId);
        // Return success with caretakerId
        res.json({ status: "success", caretakerId: user.caretakerId || null });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/caretakerlogin', (req, res) => {
    const { ctId, password } = req.body;
    CaretakerModel.findOne({ ctId }).then(user => {
        if (!user) return res.json("no_id");
        if (user.password !== password) return res.json("wrong_password");
        res.json("success");
    });
});

app.post('/submit-outing', async (req, res) => {
    try {
        const { idNumber } = req.body;
        // Removed existing and accepted checks to allow multiple requests
        await OutingStudentModel.create(req.body);
        res.json({ message: "Outing request saved" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save outing request" });
    }
});

app.post('/submit-leave', async (req, res) => {
    try {
        const { idNumber } = req.body;
        // Check if leave request with same idNumber exists
        const existingLeave = await LeaveRequestModel.findOne({ idNumber });
        if (existingLeave) {
            // Update existing leave request
            await LeaveRequestModel.updateOne({ idNumber }, req.body);
            res.json({ message: "Leave request updated" });
        } else {
            // Create new leave request
            await LeaveRequestModel.create(req.body);
            res.json({ message: "Leave request saved" });
        }
    } catch (err) {
        console.error('Error saving leave request:', err);
        res.status(500).json({ message: "Failed to save leave request", error: err.message, stack: err.stack });
    }
});

app.get('/leaverequestedstudents', async (req, res) => {
    try {
        // Temporarily disable caretakerId filtering for debugging
        // const caretakerId = req.query.caretakerId;
        // console.log('Received caretakerId in /leaverequestedstudents:', caretakerId);
        // const query = caretakerId ? { caretakerId } : {};
        const students = await LeaveRequestModel.find({});
        console.log('Number of leave requests found (no filter):', students.length);
        res.json(students);
    } catch (error) {
        console.error('Error in /leaverequestedstudents:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Debug endpoint to fetch all leave requests without filtering
app.get('/debug/all-leave-requests', async (req, res) => {
    try {
        const allLeaves = await LeaveRequestModel.find({});
        res.json(allLeaves);
    } catch (error) {
        console.error('Error in /debug/all-leave-requests:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/outingrequestedstudents', async (req, res) => {
    // Temporarily remove caretakerId filtering to debug data visibility issue
    // const caretakerId = req.query.caretakerId;
    // const query = caretakerId ? { caretakerId } : {};
    const students = await OutingStudentModel.find({});
    res.json(students);
});

app.get('/outingacceptedstudents', async (req, res) => {
    const students = await OutingAcceptedStudentModel.find();
    res.json(students);
});

app.get('/leaveacceptedstudents', async (req, res) => {
    const students = await LeaveAcceptedStudentModel.find();
    res.json(students);
});

app.post('/send-outing-mails', async (req, res) => {
    try {
        const outingResults = req.body;
        for (const student of outingResults) {
            const studentRecord = await OutingStudentModel.findOne({ idNumber: student.idNumber });
            if (!studentRecord) continue;

            if (student.decision === "Accepted") {
                await OutingAcceptedStudentModel.create({ ...studentRecord.toObject(), caretakerId: student.caretakerId });
                await EmployeeModel.findOneAndUpdate({ email: student.email }, { $inc: { count: 1 } });
            }
            await OutingStudentModel.deleteOne({ _id: studentRecord._id });
        }
        res.json({ message: "Outing processed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to process outing" });
    }
});

app.post('/send-leave-mails', async (req, res) => {
    try {
        const leaveResults = req.body;
        for (const leave of leaveResults) {
            const leaveRecord = await LeaveRequestModel.findOne({ idNumber: leave.idNumber });
            if (!leaveRecord) continue;

            if (leave.decision === "Accepted") {
                await LeaveAcceptedStudentModel.create({ ...leaveRecord.toObject(), caretakerId: leave.caretakerId });
            }
            await LeaveRequestModel.deleteOne({ _id: leaveRecord._id });
        }
        res.json({ message: "Leave processed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to process leave" });
    }
});

app.delete('/outingacceptedstudents/:idNumber', async (req, res) => {
    const result = await OutingAcceptedStudentModel.deleteOne({ idNumber: req.params.idNumber });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Checked in' });
});

app.get('/api/employees/count', async (req, res) => {
    const student = await EmployeeModel.findOne({ email: req.query.email });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json({ count: student.count });
});

app.get('/api/student/outing-records', async (req, res) => {
    const idNumber = req.query.idNumber;
    const currentOutings = await OutingStudentModel.find({ idNumber });
    const previousOutings = await OutingAcceptedStudentModel.find({ idNumber });
    res.json({ currentOutings, previousOutings });
});

app.get('/api/student/leave-records', async (req, res) => {
    const idNumber = req.query.idNumber;
    try {
        const leaveRequests = await LeaveRequestModel.find({ idNumber });
        const acceptedLeaves = await LeaveAcceptedStudentModel.find({ idNumber });
        const now = new Date();
        const currentLeaves = leaveRequests; // pending requests (not responded)
        const previousLeaves = [
            ...acceptedLeaves, // accepted leaves
            ...leaveRequests.filter(leave => new Date(leave.leaveEnd) < now) // expired leave requests
        ];
        res.json({ currentLeaves, previousLeaves });
    } catch (error) {
        console.error('Error fetching leave records:', error);
        res.status(500).json({ message: 'Failed to fetch leave records' });
    }
});

app.post('/update-caretaker-id-in-leave-requests', async (req, res) => {
    const { caretakerId } = req.body;
    if (!caretakerId) {
        return res.status(400).json({ message: 'caretakerId is required' });
    }
    try {
        const docs = await LeaveRequestModel.find({
            $or: [
                { caretakerId: { $exists: false } },
                { caretakerId: { $ne: caretakerId } }
            ]
        });
        for (const doc of docs) {
            doc.caretakerId = caretakerId;
            await doc.save();
        }
        res.json({ message: `Updated ${docs.length} leave requests with caretakerId ${caretakerId}` });
    } catch (error) {
        console.error('Error updating caretakerId in leave requests:', error);
        res.status(500).json({ message: 'Failed to update caretakerId in leave requests' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
