# InterviewAI REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register Candidate
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Body**:
```json
{
  "name": "Alex Rivera",
  "email": "alex@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```
- **Response** `(201 Created)`:
```json
{
  "success": true,
  "message": "Account registered successfully",
  "data": {
    "user": { "id": "...", "name": "Alex Rivera", "email": "alex@example.com", "role": "candidate" },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "48b6..."
  }
}
```

### Login
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Body**:
```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

### Token Refresh
- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Body**:
```json
{
  "refreshToken": "48b6..."
}
```

### Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`

---

## 2. Resume Endpoints

### Upload Resume
- **Method**: `POST`
- **Endpoint**: `/resumes`
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data**: `resume: <file.pdf | file.docx>`

### Run AI Resume Analysis
- **Method**: `POST`
- **Endpoint**: `/resumes/:id/analyze`
- **Headers**: `Authorization: Bearer <token>`
- **Response** `(200 OK)`:
```json
{
  "success": true,
  "data": {
    "resume": {
      "scores": { "overall": 88, "technicalSkills": 90, "experience": 84, "projects": 92 },
      "analysis": {
        "technicalSkills": ["React", "Node.js", "MongoDB"],
        "strengths": ["Strong modern React lifecycle grasp"],
        "weaknesses": ["Microservices scaling details"]
      }
    }
  }
}
```

---

## 3. Interview Simulation Endpoints

### Create Interview Session
- **Method**: `POST`
- **Endpoint**: `/interviews`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "role": "Full Stack Developer",
  "type": "Technical",
  "difficulty": "Medium",
  "experienceLevel": "1-3 years",
  "totalQuestionsCount": 5,
  "targetDurationMinutes": 30,
  "useResume": true
}
```

### Submit Answer with AI Evaluation
- **Method**: `POST`
- **Endpoint**: `/interviews/:id/answers`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "questionOrder": 1,
  "candidateAnswer": "useMemo caches computed return values...",
  "timeSpentSeconds": 120,
  "isSkipped": false
}
```
- **Response** `(200 OK)`:
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "score": 9,
      "correctness": 9,
      "technicalKnowledge": 9,
      "communication": 8,
      "shortFeedback": "Strong answer demonstrating solid conceptual understanding.",
      "missingConcepts": [],
      "suggestedBetterAnswer": "...",
      "followUpQuestion": "How does React 18 automatic batching affect re-renders?",
      "shouldAskFollowUp": true
    }
  }
}
```

### Complete Interview & Generate Scorecard
- **Method**: `POST`
- **Endpoint**: `/interviews/:id/finish`
- **Headers**: `Authorization: Bearer <token>`

### Get Full Report
- **Method**: `GET`
- **Endpoint**: `/interviews/:id/report`
- **Headers**: `Authorization: Bearer <token>`

---

## 4. Admin Management Endpoints
*(Requires `Authorization: Bearer <admin_token>` and `role === 'admin'`)*

- `GET /api/admin/dashboard` - Platform overview metrics
- `GET /api/admin/users` - Paginated user directory
- `PATCH /api/admin/users/:id/status` - Toggle active/deactivated
- `GET /api/admin/questions` - Question bank list
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/prompts` - View system prompt versions
- `POST /api/admin/prompts` - Create new system prompt version
