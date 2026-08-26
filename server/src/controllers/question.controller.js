const Question = require('../models/Question');
const Category = require('../models/Category');
const JobRole = require('../models/JobRole');
const evaluationService = require('../services/ai/evaluation.service');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/questions
const getQuestions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }
  if (req.query.role && req.query.role !== 'All') {
    query.role = new RegExp(req.query.role, 'i');
  }
  if (req.query.difficulty && req.query.difficulty !== 'All') {
    query.difficulty = req.query.difficulty;
  }
  if (req.query.search) {
    query.$or = [
      { question: new RegExp(req.query.search, 'i') },
      { tags: new RegExp(req.query.search, 'i') }
    ];
  }

  const total = await Question.countDocuments(query);
  const questions = await Question.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(res, 200, 'Questions retrieved', {
    questions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @route GET /api/questions/:id
const getQuestionById = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return next(new AppError('Question not found.', 404));
  }
  return ApiResponse.success(res, 200, 'Question retrieved', { question });
});

// @route GET /api/practice/random
const getRandomPracticeQuestion = asyncHandler(async (req, res, next) => {
  const query = {};
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }
  if (req.query.difficulty && req.query.difficulty !== 'All') {
    query.difficulty = req.query.difficulty;
  }

  const count = await Question.countDocuments(query);
  if (count === 0) {
    return next(new AppError('No questions found matching selected criteria.', 404));
  }

  const randomIdx = Math.floor(Math.random() * count);
  const question = await Question.findOne(query).skip(randomIdx);

  return ApiResponse.success(res, 200, 'Practice question retrieved', { question });
});

// @route POST /api/practice/evaluate
const evaluatePracticeAnswer = asyncHandler(async (req, res, next) => {
  const { questionText, category, difficulty, candidateAnswer, expectedConcepts } = req.body;

  const evaluation = await evaluationService.evaluateAnswer({
    questionText,
    category,
    difficulty,
    expectedConcepts: expectedConcepts || ['Core fundamentals', 'Best practices'],
    idealAnswerPoints: ['Clear structured explanation with practical examples'],
    candidateAnswer,
    timeSpentSeconds: 60,
    isSkipped: false
  });

  return ApiResponse.success(res, 200, 'Practice answer evaluated', { evaluation });
});

// @route GET /api/categories
const getPublicCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  return ApiResponse.success(res, 200, 'Categories retrieved', { categories });
});

// @route GET /api/job-roles
const getPublicJobRoles = asyncHandler(async (req, res, next) => {
  const roles = await JobRole.find({ isActive: true }).sort({ name: 1 });
  return ApiResponse.success(res, 200, 'Job roles retrieved', { jobRoles: roles });
});

module.exports = {
  getQuestions,
  getQuestionById,
  getRandomPracticeQuestion,
  evaluatePracticeAnswer,
  getPublicCategories,
  getPublicJobRoles
};
