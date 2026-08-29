"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const memoryRecords = [];
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../src')));
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => res.status(204).end());
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db';
mongoose_1.default
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => {
    const message = err instanceof Error ? err.message : 'Unknown MongoDB connection error';
    console.warn('MongoDB unavailable, continuing in memory-only mode:', message);
});
const AttendanceSchema = new mongoose_1.default.Schema({
    studentName: { type: String, required: true, trim: true },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent', 'Late']
    },
    date: { type: Date, default: Date.now }
});
const Attendance = mongoose_1.default.model('Attendance', AttendanceSchema);
const saveAttendanceRecord = async (payload) => {
    if (mongoose_1.default.connection.readyState === 1) {
        const record = new Attendance(payload);
        return await record.save();
    }
    const memoryRecord = {
        _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        studentName: String(payload.studentName),
        status: payload.status,
        date: payload.date ? new Date(String(payload.date)) : new Date()
    };
    memoryRecords.unshift(memoryRecord);
    return memoryRecord;
};
const getAttendanceRecords = async () => {
    if (mongoose_1.default.connection.readyState === 1) {
        return await Attendance.find().sort({ date: -1 });
    }
    return [...memoryRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
app.post('/api/attendance', async (req, res) => {
    try {
        const record = await saveAttendanceRecord(req.body);
        res.status(201).json({ message: 'Attendance marked successfully', record });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        res.status(400).json({ error: message });
    }
});
app.get('/api/attendance', async (_req, res) => {
    try {
        const records = await getAttendanceRecords();
        res.json(records);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
});
app.get('/health', (_req, res) => res.status(200).send('OK'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
