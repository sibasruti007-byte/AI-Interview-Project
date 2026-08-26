const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview_ai_test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  await User.deleteMany({ email: /test.*@interviewai.com/ });
  await mongoose.disconnect();
});

describe('Authentication API Suite', () => {
  const testUser = {
    name: 'Test Candidate',
    email: `test_${Date.now()}@interviewai.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!'
  };

  it('POST /api/auth/register - should successfully register a candidate', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('POST /api/auth/login - should authenticate valid user and return JWT tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('POST /api/auth/login - should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123!'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
