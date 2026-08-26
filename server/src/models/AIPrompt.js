const mongoose = require('mongoose');

const aiPromptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['resume_analysis', 'question_generation', 'answer_evaluation', 'follow_up', 'report_generation', 'practice_evaluation'],
      required: true,
      index: true
    },
    version: {
      type: Number,
      default: 1
    },
    description: {
      type: String,
      default: ''
    },
    systemPrompt: {
      type: String,
      required: true
    },
    template: {
      type: String,
      required: true
    },
    parameters: [
      {
        name: String,
        description: String,
        required: { type: Boolean, default: true }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
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

aiPromptSchema.index({ type: 1, version: -1 });

const AIPrompt = mongoose.model('AIPrompt', aiPromptSchema);
module.exports = AIPrompt;
