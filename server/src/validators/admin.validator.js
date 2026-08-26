const { z } = require('zod');

const questionAdminSchema = z.object({
  body: z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
    category: z.string().min(1, 'Category is required'),
    role: z.string().min(1, 'Role is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Expert']),
    type: z.enum(['Technical', 'HR', 'Behavioral', 'Coding', 'System Design', 'Mixed', 'Resume-Based']).default('Technical'),
    expectedConcepts: z.array(z.string()).default([]),
    evaluationCriteria: z.array(z.string()).default([]),
    idealAnswerPoints: z.array(z.string()).default([]),
    codeStarter: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

const categoryAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    description: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean().default(true)
  })
});

const jobRoleAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters'),
    description: z.string().optional(),
    skills: z.array(z.string()).default([]),
    experienceRanges: z.array(z.enum(['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'])).default(['Fresher', '1-3 years', '3-5 years']),
    icon: z.string().optional(),
    isActive: z.boolean().default(true)
  })
});

const promptAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Prompt name is required'),
    type: z.enum(['resume_analysis', 'question_generation', 'answer_evaluation', 'follow_up', 'report_generation', 'practice_evaluation']),
    systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters'),
    template: z.string().min(10, 'Prompt template must be at least 10 characters'),
    description: z.string().optional(),
    parameters: z.array(z.object({
      name: z.string(),
      description: z.string(),
      required: z.boolean().default(true)
    })).default([]),
    isActive: z.boolean().default(true)
  })
});

module.exports = {
  questionAdminSchema,
  categoryAdminSchema,
  jobRoleAdminSchema,
  promptAdminSchema
};
