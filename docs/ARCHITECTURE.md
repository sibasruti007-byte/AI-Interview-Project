# InterviewAI System Architecture & Security Specification

## 1. Architectural Layers

```
                          ┌─────────────────────────────┐
                          │   Frontend: React + Vite    │
                          │ TailwindCSS, Recharts, Lucide│
                          └──────────────┬──────────────┘
                                         │ Axios (JWT + Interceptors)
                                         ▼
                          ┌─────────────────────────────┐
                          │   Backend: Express.js REST  │
                          │ Security, RBAC, Rate-Limits │
                          └───────┬──────────────┬──────┘
                                  │              │
                   Mongoose / ODM │              │ AI Service Provider
                                  ▼              ▼ (OpenAI / Gemini / Fallback)
                          ┌──────────────┐ ┌───────────────────┐
                          │ MongoDB      │ │ Dedicated LLM API │
                          │ 11+ Models   │ │ Structured JSON   │
                          └──────────────┘ └───────────────────┘
```

---

## 2. Authentication & Session Strategy
- **Short-Lived Access Tokens**: Signed JWTs expiring in 15 minutes holding minimal identity (`id`, `email`, `role`).
- **Rotating Refresh Tokens**: Cryptographically secure 40-byte random tokens hashed with SHA-256 and stored in MongoDB.
- **Theft Detection & Family Revocation**: If a revoked refresh token is presented, all refresh tokens for that user are immediately invalidated.
- **RBAC**: Strict backend server authorization using `protect` and `restrictTo('admin')` middleware.

---

## 3. Dedicated AI Service Layer
- Centralized in `server/src/services/ai/`.
- Multi-provider support (Gemini, OpenAI) with automatic structured JSON parsing and sanitization.
- Analytical fallback engine ensures 100% availability for testing without external API key dependencies.
- Dynamic prompt loader hydrates templates from MongoDB `AIPrompt` versioned collections.

---

## 4. File Handling & Resume Security
- Multer with sanitized random filenames and isolated upload directory.
- MIME type and file extension verification preventing script execution.
- Text extractors (`pdf-parse` & `mammoth`) operate strictly on stream/buffer data in memory.
