const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    customQuestionText: {
      type: String
    },
    category: {
      type: String,
      default: 'General'
    },
    difficulty: {
      type: String,
      default: 'Medium'
    },
    role: {
      type: String,
      default: 'Software Engineer'
    },
    notes: {
      type: String,
      default: ''
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

bookmarkSchema.index({ user: 1, question: 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
