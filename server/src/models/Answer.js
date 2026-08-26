const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    questionOrder: {
      type: Number,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    questionCategory: {
      type: String,
      default: 'General'
    },
    questionDifficulty: {
      type: String,
      default: 'Medium'
    },
    candidateAnswer: {
      type: String,
      default: ''
    },
    codeAnswer: {
      language: { type: String, default: 'javascript' },
      code: { type: String, default: '' },
      passedTestCases: { type: Number, default: 0 },
      totalTestCases: { type: Number, default: 0 }
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    },
    evaluation: {
      score: { type: Number, default: 0 }, // 0 to 10
      correctness: { type: Number, default: 0 },
      relevance: { type: Number, default: 0 },
      technicalKnowledge: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      shortFeedback: { type: String, default: '' },
      detailedFeedback: { type: String, default: '' },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      correctConcepts: [{ type: String }],
      missingConcepts: [{ type: String }],
      suggestedBetterAnswer: { type: String, default: '' },
      followUpQuestion: { type: String, default: '' },
      shouldAskFollowUp: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

answerSchema.index({ interview: 1, questionOrder: 1 }, { unique: true });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
