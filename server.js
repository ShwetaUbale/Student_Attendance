const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Silence Chrome DevTools and browser favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => res.status(204).end());

// MongoDB Connection
// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://host.docker.internal:27017/attendance_db';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model
const AttendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ['Present', 'Absent', 'Late']
  },
  date: { type: Date, default: Date.now }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

// --- MODULE APIs ---

// 1. Teacher Module: Mark Attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json({ message: 'Attendance marked successfully', record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Student & Admin Module: View Attendance
app.get('/api/attendance', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint for testing/Jenkins
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));