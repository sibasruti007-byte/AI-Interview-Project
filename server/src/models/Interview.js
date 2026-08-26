const mongoose = require('mongoose');

const interviewQuestionItemSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    questionText: { type: String, required: true },
    category: { type: String, default: 'General' },
    difficulty: { type: String, default: 'Medium' },
    type: { type: String, default: 'Technical' },
    expectedConcepts: [{ type: String }],
    evaluationCriteria: [{ type: String }],
    idealAnswerPoints: [{ type: String }],
    codeStarter: { type: String, default: '' },
    order: { type: Number, required: true },
    isAnswered: { type: Boolean, default: false },
    isSkipped: { type: Boolean, default: false },
    followUpFor: { type: Number, default: null }
  },
  { _id: true }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Resume-Based', 'Coding', 'System Design', 'Mixed'],
      default: 'Technical'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
      default: 'Medium'
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
      default: '1-3 years'
    },
    targetDurationMinutes: {
      type: Number,
      default: 30
    },
    totalQuestionsCount: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ['created', 'in_progress', 'paused', 'completed', 'expired', 'cancelled'],
      default: 'created',
      index: true
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    actualDurationSeconds: {
      type: Number,
      default: 0
    },
    resumeUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    questions: [interviewQuestionItemSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    scores: {
      overall: { type: Number, default: 0 },
      technicalScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
      correctnessScore: { type: Number, default: 0 }
    },
    report: {
      summary: String,
      overallAssessment: String,
      strongAreas: [String],
      weakAreas: [String],
      skillsEvaluated: [
        {
          skill: String,
          score: Number
        }
      ],
      aiRecommendations: [String],
      suggestedNextPracticeTopics: [String],
      generatedAt: Date
    }
  },
  {
    timestamps: true
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
