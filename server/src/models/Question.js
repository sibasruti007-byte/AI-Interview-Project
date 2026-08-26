const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    role: {
      type: String,
      required: true,
      index: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
      default: 'Medium',
      index: true
    },
    type: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'Coding', 'System Design', 'Mixed', 'Resume-Based'],
      default: 'Technical'
    },
    expectedConcepts: [
      {
        type: String,
        trim: true
      }
    ],
    evaluationCriteria: [
      {
        type: String,
        trim: true
      }
    ],
    idealAnswerPoints: [
      {
        type: String,
        trim: true
      }
    ],
    codeStarter: {
      type: String,
      default: ''
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false }
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    isSeeded: {
      type: Boolean,
      default: false
    },
    isAIGenerated: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ role: 1, difficulty: 1 });
questionSchema.index({ question: 'text', tags: 'text' });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
