const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/bookmarks
const getBookmarks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category;
  }
  if (req.query.difficulty && req.query.difficulty !== 'All') {
    query.difficulty = req.query.difficulty;
  }

  const total = await Bookmark.countDocuments(query);
  const bookmarks = await Bookmark.find(query)
    .populate('question')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return ApiResponse.success(res, 200, 'Bookmarks retrieved', {
    bookmarks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @route POST /api/bookmarks
const addBookmark = asyncHandler(async (req, res, next) => {
  const { questionId, customQuestionText, category, difficulty, role, notes, tags } = req.body;

  let questionDoc = null;
  if (questionId) {
    questionDoc = await Question.findById(questionId);
  }

  const existing = await Bookmark.findOne({
    user: req.user._id,
    ...(questionId ? { question: questionId } : { customQuestionText })
  });

  if (existing) {
    return next(new AppError('This question is already bookmarked.', 400));
  }

  const bookmark = await Bookmark.create({
    user: req.user._id,
    question: questionDoc ? questionDoc._id : null,
    customQuestionText: customQuestionText || (questionDoc ? questionDoc.question : ''),
    category: category || (questionDoc ? questionDoc.category : 'General'),
    difficulty: difficulty || (questionDoc ? questionDoc.difficulty : 'Medium'),
    role: role || (questionDoc ? questionDoc.role : 'Software Engineer'),
    notes: notes || '',
    tags: tags || (questionDoc ? questionDoc.tags : [])
  });

  return ApiResponse.created(res, 'Question bookmarked successfully', { bookmark });
});

// @route PUT /api/bookmarks/:id
const updateBookmark = asyncHandler(async (req, res, next) => {
  const { notes, tags } = req.body;
  const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });

  if (!bookmark) {
    return next(new AppError('Bookmark not found.', 404));
  }

  if (notes !== undefined) bookmark.notes = notes;
  if (tags !== undefined) bookmark.tags = tags;

  await bookmark.save();

  return ApiResponse.success(res, 200, 'Bookmark updated', { bookmark });
});

// @route DELETE /api/bookmarks/:id
const deleteBookmark = asyncHandler(async (req, res, next) => {
  const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });
  if (!bookmark) {
    return next(new AppError('Bookmark not found.', 404));
  }

  await Bookmark.deleteOne({ _id: bookmark._id });

  return ApiResponse.success(res, 200, 'Bookmark removed');
});

module.exports = {
  getBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark
};
