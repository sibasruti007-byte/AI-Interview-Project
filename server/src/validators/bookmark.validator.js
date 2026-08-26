const { z } = require('zod');

const createBookmarkSchema = z.object({
  body: z.object({
    questionId: z.string().optional(),
    customQuestionText: z.string().optional(),
    category: z.string().default('General'),
    difficulty: z.string().default('Medium'),
    role: z.string().default('Software Engineer'),
    notes: z.string().default(''),
    tags: z.array(z.string()).default([])
  }).refine((data) => data.questionId || (data.customQuestionText && data.customQuestionText.trim().length > 0), {
    message: 'Either questionId or customQuestionText must be provided'
  })
});

const updateBookmarkSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Bookmark ID is required')
  }),
  body: z.object({
    notes: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

module.exports = {
  createBookmarkSchema,
  updateBookmarkSchema
};
