const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview_ai',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'interview_ai_access_secret_key_default_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'interview_ai_refresh_secret_key_default_2026',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gemini-1.5-flash',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  ADMIN_NAME: process.env.ADMIN_NAME || 'Super Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@interviewai.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPass123!',
  DEMO_CANDIDATE_EMAIL: process.env.DEMO_CANDIDATE_EMAIL || 'candidate@interviewai.com',
  DEMO_CANDIDATE_PASSWORD: process.env.DEMO_CANDIDATE_PASSWORD || 'CandidatePass123!'
};
