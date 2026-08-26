const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url().or(z.literal('')).optional(),
    phone: z.string().max(20).optional(),
    location: z.string().max(100).optional(),
    bio: z.string().max(1000).optional(),
    college: z.string().max(150).optional(),
    degree: z.string().max(100).optional(),
    graduationYear: z.number().int().min(1970).max(2035).optional(),
    experienceLevel: z.enum(['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years']).optional(),
    currentRole: z.string().max(100).optional(),
    targetRole: z.string().max(100).optional(),
    skills: z.array(z.string()).optional(),
    github: z.string().url().or(z.literal('')).optional(),
    linkedin: z.string().url().or(z.literal('')).optional(),
    portfolio: z.string().url().or(z.literal('')).optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmNewPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema
};
