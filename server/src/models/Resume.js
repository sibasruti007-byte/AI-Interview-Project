const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['uploaded', 'analyzing', 'analyzed', 'failed'],
      default: 'uploaded'
    },
    analysis: {
      extractedCandidateName: String,
      experienceLevel: String,
      yearsOfExperience: Number,
      technicalSkills: [String],
      softSkills: [String],
      technologies: [String],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
          gpa: String
        }
      ],
      workExperience: [
        {
          role: String,
          company: String,
          duration: String,
          summary: String,
          highlights: [String]
        }
      ],
      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
          link: String
        }
      ],
      certifications: [String],
      achievements: [String],
      recommendedJobRoles: [String],
      strengths: [String],
      weaknesses: [String],
      missingSkills: [String],
      suggestedImprovements: [String]
    },
    scores: {
      overall: { type: Number, default: 0 },
      technicalSkills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      achievements: { type: Number, default: 0 },
      resumeQuality: { type: Number, default: 0 }
    },
    isCurrentActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
