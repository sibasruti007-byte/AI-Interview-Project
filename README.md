# InterviewAI — Production-Grade AI Technical & Behavioral Interview SaaS Platform

**InterviewAI** is an enterprise-ready, autonomous AI-powered technical and behavioral mock interview SaaS platform designed for software engineers. It provides dynamic adaptive simulations, resume parsing and skill gap scoring, real-time code evaluation, multidimensional radar scorecards, question bookmarking, topic practice drills, and a comprehensive Admin management portal.

---

## 🌟 Key Features

### 1. Dynamic Adaptive AI Interview Simulations
- **Real-time Question Generation**: Questions dynamically tailored to selected job role, difficulty, experience level, and verified resume keywords.
- **Adaptive Follow-Up Interrogation**: If an answer lacks depth or misses architectural trade-offs, the AI dynamically injects a targeted follow-up question.
- **Dual Answer Modes**: Clean text explanation mode with word counter and an integrated Sandbox Code Arena with language syntax starters and test cases.
- **Distraction-Free Arena**: Live animated countdown timer with warning alerts and auto-finish safeguards.

### 2. Resume Parsing & AI Scoring
- **Multi-Format Extraction**: Supports PDF, DOC, and DOCX files up to 10MB with strict MIME-type and magic-bytes validation.
- **Dimensional Scoring**: Scores 6 dimensions out of 100: Technical Skills, Experience, Projects, Education, Achievements, and Overall Resume Quality.
- **Gap & Actionable Analysis**: Pinpoints strengths, missing skills, and provides concrete bullet-point improvements.

### 3. Comprehensive Post-Interview Scorecards & Analytics
- **Multidimensional Metrics**: Overall Score, Technical Knowledge, Communication, Problem Solving, and Correctness.
- **Question-by-Question Deep Review**: Side-by-side comparison of candidate submitted answers against model senior engineering benchmarks.
- **Actionable AI Practice Plan**: One-click targeted practice drill links for identified weak topics.
- **Recharts Analytics**: Historical score progressions, domain proficiency radars, and streak counters.

### 4. Admin Management Portal
- **Platform Analytics**: Total candidates, simulation volume, average platform scores, and AI compute call trackers.
- **User Management**: Server-side paginated candidate directory with role assignment and activation toggles.
- **Question Bank CRUD**: Full management of 100+ curated interview questions across 14 categories and 12 job roles.
- **Taxonomy & Role Management**: Real-time management of categories and job roles.
- **AI System Prompts Manager**: Version control system prompts for resume analysis, question generation, answer evaluation, and report synthesis.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18, Vite
- **Styling**: Tailwind CSS (with persistent Dark/Light mode theme system)
- **Routing**: React Router v6
- **State & Forms**: Context API, React Hook Form, Zod Validation
- **Charts & UI**: Recharts, Lucide React Icons, React Hot Toast

### Backend
- **Runtime**: Node.js, Express.js (REST API Architecture)
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: Access Tokens (15m) + Refresh Token Rotation in MongoDB with SHA-256 hashing, bcrypt password hashing, and strict RBAC middleware
- **Security**: Helmet, CORS, Rate Limiters, Input Sanitization, Zod Schemas
- **File Processing**: Multer, pdf-parse, mammoth

### Dedicated AI Layer
- **Unified Multi-Provider Service**: Pluggable support for Google Gemini (`@google/genai`), OpenAI (`openai`), and a built-in analytical heuristic fallback engine when API keys are not supplied.
- **Strict Structured JSON**: Guaranteed valid JSON parsing and output sanitization.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Active local instance (`mongodb://127.0.0.1:27017/interview_ai`) or MongoDB Atlas URI.

### 2. Installation
Install all dependencies across root, server, and client:
```bash
# In the project root directory
npm run install:all
```

### 3. Environment Configuration
Create `server/.env` (an example is provided at `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/interview_ai

JWT_ACCESS_SECRET=interview_ai_super_secret_access_jwt_key_2026
JWT_REFRESH_SECRET=interview_ai_super_secret_refresh_jwt_key_2026
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# AI Provider Configuration ('gemini', 'openai', or 'mock')
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-1.5-flash

# Seed Credentials
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@interviewai.com
ADMIN_PASSWORD=AdminPass123!
DEMO_CANDIDATE_EMAIL=candidate@interviewai.com
DEMO_CANDIDATE_PASSWORD=CandidatePass123!
```

### 4. Database Seeding
Populate the database with 100+ interview questions, categories, job roles, default AI prompt templates, admin credentials, and candidate demo data:
```bash
npm run seed
```

### 5. Running the Application
Run both backend server and Vite client concurrently:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@interviewai.com` | `AdminPass123!` | Full Admin Portal & System Prompts |
| **Candidate** | `candidate@interviewai.com` | `CandidatePass123!` | Candidate Dashboard, Simulations & Analytics |

*(A one-click demo login button is also provided on the Login screen).*

---

## 🧪 Testing Suite
Run automated backend unit and integration tests:
```bash
npm test
```

---

## 📚 Documentation
- [REST API Specification](docs/API.md)
- [System Architecture & Security Model](docs/ARCHITECTURE.md)
