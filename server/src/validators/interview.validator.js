const { z } = require('zod');

const createInterviewSchema = z.object({
  body: z.object({
    role: z.string().min(2, 'Job role is required'),
    type: z.enum(['Technical', 'HR', 'Behavioral', 'Resume-Based', 'Coding', 'System Design', 'Mixed']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Expert']),
    experienceLevel: z.enum(['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years']),
    totalQuestionsCount: z.number().int().refine((val) => [5, 10, 15, 20].includes(val), {
      message: 'Question count must be 5, 10, 15, or 20'
    }),
    targetDurationMinutes: z.number().int().refine((val) => [15, 30, 45, 60].includes(val), {
      message: 'Duration must be 15, 30, 45, or 60 minutes'
    }),
    useResume: z.boolean().optional()
  })
});

const submitAnswerSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Interview ID is required')
  }),
  body: z.object({
    questionOrder: z.number().int().min(0),
    candidateAnswer: z.string().optional(),
    codeAnswer: z
      .object({
        language: z.string().default('javascript'),
        code: z.string().default(''),
        passedTestCases: z.number().default(0),
        totalTestCases: z.number().default(0)
      })
      .optional(),
    timeSpentSeconds: z.number().int().min(0).default(0),
    isSkipped: z.boolean().default(false)
  }).refine((data) => data.isSkipped || (data.candidateAnswer && data.candidateAnswer.trim().length > 0) || (data.codeAnswer && data.codeAnswer.code.trim().length > 0), {
    message: 'Please provide an answer or mark question as skipped'
  })
});

const evaluatePracticeSchema = z.object({
  body: z.object({
    questionText: z.string().min(5, 'Question text is required'),
    category: z.string().default('General'),
    difficulty: z.string().default('Medium'),
    candidateAnswer: z.string().min(2, 'Candidate answer is required'),
    expectedConcepts: z.array(z.string()).optional()
  })
});

module.exports = {
  createInterviewSchema,
  submitAnswerSchema,
  evaluatePracticeSchema
};
