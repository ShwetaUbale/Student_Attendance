import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';

const app = express();
const memoryRecords: Array<{
  _id: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  date: Date | string;
}> = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

app.get('/favicon.ico', (_req: Request, res: Response) => res.status(204).end());
app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req: Request, res: Response) => res.status(204).end());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db';

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Unknown MongoDB connection error';
    console.warn('MongoDB unavailable, continuing in memory-only mode:', message);
  });

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

const saveAttendanceRecord = async (payload: Record<string, unknown>) => {
  if (mongoose.connection.readyState === 1) {
    const record = new Attendance(payload);
    return await record.save();
  }

  const memoryRecord = {
    _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    studentName: String(payload.studentName),
    status: payload.status as 'Present' | 'Absent' | 'Late',
    date: payload.date ? new Date(String(payload.date)) : new Date()
  };

  memoryRecords.unshift(memoryRecord);
  return memoryRecord;
};

const getAttendanceRecords = async () => {
  if (mongoose.connection.readyState === 1) {
    return await Attendance.find().sort({ date: -1 });
  }

  return [...memoryRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

app.post('/api/attendance', async (req: Request, res: Response) => {
  try {
    const record = await saveAttendanceRecord(req.body);
    res.status(201).json({ message: 'Attendance marked successfully', record });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

app.get('/api/attendance', async (_req: Request, res: Response) => {
  try {
    const records = await getAttendanceRecords();
    res.json(records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

app.get('/health', (_req: Request, res: Response) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
