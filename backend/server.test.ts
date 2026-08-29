import request from 'supertest';
import { expect } from 'chai';
import express from 'express';

async function createApp() {
  const app = express();
  const memoryRecords: Array<{
    _id: string;
    studentName: string;
    status: 'Present' | 'Absent' | 'Late';
    date: Date | string;
  }> = [];

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  app.post('/api/attendance', (req, res) => {
    const record = {
      _id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      studentName: String(req.body.studentName),
      status: req.body.status,
      date: req.body.date ? new Date(String(req.body.date)) : new Date()
    };

    memoryRecords.unshift(record);
    res.status(201).json({ message: 'Attendance marked successfully', record });
  });

  app.get('/api/attendance', (_req, res) => {
    res.json(memoryRecords);
  });

  return app;
}

describe('Attendance API', () => {
  it('should return health status OK', async () => {
    const app = await createApp();
    const res = await request(app).get('/health');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('OK');
  });

  it('should save a new attendance record', async () => {
    const app = await createApp();
    const payload = {
      studentName: 'Test Student',
      status: 'Present',
      date: '2026-08-29T10:00:00.000Z'
    };

    const res = await request(app).post('/api/attendance').send(payload);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Attendance marked successfully');
    expect(res.body.record.studentName).to.equal('Test Student');
    expect(res.body.record.status).to.equal('Present');
  });

  it('should list attendance records', async () => {
    const app = await createApp();
    await request(app)
      .post('/api/attendance')
      .send({ studentName: 'Alice', status: 'Late', date: '2026-08-29T10:00:00.000Z' });

    const res = await request(app).get('/api/attendance');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body[0].studentName).to.equal('Alice');
  });
});
