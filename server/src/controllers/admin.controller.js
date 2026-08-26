const User = require('../models/User');
const Question = require('../models/Question');
const Category = require('../models/Category');
const JobRole = require('../models/JobRole');
const AIPrompt = require('../models/AIPrompt');
const Interview = require('../models/Interview');
const analyticsService = require('../services/analytics.service');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ==================== DASHBOARD ====================
const getAdminDashboard = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getAdminDashboardMetrics();
  return ApiResponse.success(res, 200, 'Admin dashboard metrics retrieved', data);
});

// ==================== USERS MANAGEMENT ====================
const getAdminUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.role && req.query.role !== 'All') {
    query.role = req.query.role;
  }
  if (req.query.status && req.query.status !== 'All') {
    query.isActive = req.query.status === 'active';
  }
  if (req.query.search) {
    query.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') }
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-password');

  return ApiResponse.success(res, 200, 'Users retrieved', {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

const toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Prevent self-deactivation of logged in admin
  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError('You cannot deactivate your own admin account.', 400));
  }

  user.isActive = !user.isActive;
  await user.save();

  return ApiResponse.success(res, 200, `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`, { user });
});

const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  if (!['candidate', 'admin'].includes(role)) {
    return next(new AppError('Invalid role specified.', 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  return ApiResponse.success(res, 200, 'User role updated successfully', { user });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    return next(new AppError('You cannot delete your own admin account.', 400));
  }

  await User.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 200, 'User deleted successfully');
});

// ==================== QUESTION BANK MANAGEMENT ====================
const getAdminQuestions = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
  if (req.query.role && req.query.role !== 'All') query.role = new RegExp(req.query.role, 'i');
  if (req.query.difficulty && req.query.difficulty !== 'All') query.difficulty = req.query.difficulty;
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

const createQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.create({
    ...req.body,
    createdBy: req.user._id
  });
  return ApiResponse.created(res, 'Question created successfully', { question });
});

const updateQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!question) {
    return next(new AppError('Question not found.', 404));
  }
  return ApiResponse.success(res, 200, 'Question updated successfully', { question });
});

const deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) {
    return next(new AppError('Question not found.', 404));
  }
  return ApiResponse.success(res, 200, 'Question deleted successfully');
});

// ==================== CATEGORIES MANAGEMENT ====================
const getAdminCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });
  return ApiResponse.success(res, 200, 'Categories retrieved', { categories });
});

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  return ApiResponse.created(res, 'Category created', { category });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return next(new AppError('Category not found.', 404));
  return ApiResponse.success(res, 200, 'Category updated', { category });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 200, 'Category deleted');
});

// ==================== JOB ROLES MANAGEMENT ====================
const getAdminJobRoles = asyncHandler(async (req, res, next) => {
  const roles = await JobRole.find().sort({ name: 1 });
  return ApiResponse.success(res, 200, 'Job roles retrieved', { jobRoles: roles });
});

const createJobRole = asyncHandler(async (req, res, next) => {
  const role = await JobRole.create(req.body);
  return ApiResponse.created(res, 'Job role created', { jobRole: role });
});

const updateJobRole = asyncHandler(async (req, res, next) => {
  const role = await JobRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!role) return next(new AppError('Job role not found.', 404));
  return ApiResponse.success(res, 200, 'Job role updated', { jobRole: role });
});

const deleteJobRole = asyncHandler(async (req, res, next) => {
  await JobRole.findByIdAndDelete(req.params.id);
  return ApiResponse.success(res, 200, 'Job role deleted');
});

// ==================== AI PROMPTS MANAGEMENT ====================
const getAdminPrompts = asyncHandler(async (req, res, next) => {
  const prompts = await AIPrompt.find().sort({ type: 1, version: -1 });
  return ApiResponse.success(res, 200, 'AI Prompts retrieved', { prompts });
});

const createPromptVersion = asyncHandler(async (req, res, next) => {
  const { type, name, systemPrompt, template, description, parameters, isActive } = req.body;

  // Find highest version for this type
  const latest = await AIPrompt.findOne({ type }).sort({ version: -1 });
  const newVersion = latest ? latest.version + 1 : 1;

  if (isActive) {
    // Deactivate previous active version
    await AIPrompt.updateMany({ type }, { isActive: false });
  }

  const prompt = await AIPrompt.create({
    name,
    type,
    version: newVersion,
    systemPrompt,
    template,
    description,
    parameters: parameters || [],
    isActive: !!isActive,
    createdBy: req.user._id
  });

  return ApiResponse.created(res, 'New AI Prompt version created successfully', { prompt });
});

const updatePrompt = asyncHandler(async (req, res, next) => {
  const { isActive, systemPrompt, template, name, description } = req.body;
  const prompt = await AIPrompt.findById(req.params.id);
  if (!prompt) return next(new AppError('Prompt not found.', 404));

  if (isActive !== undefined && isActive === true) {
    await AIPrompt.updateMany({ type: prompt.type }, { isActive: false });
    prompt.isActive = true;
  } else if (isActive !== undefined) {
    prompt.isActive = isActive;
  }

  if (systemPrompt) prompt.systemPrompt = systemPrompt;
  if (template) prompt.template = template;
  if (name) prompt.name = name;
  if (description !== undefined) prompt.description = description;

  await prompt.save();
  return ApiResponse.success(res, 200, 'AI Prompt updated successfully', { prompt });
});

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
  getAdminPrompts,
  createPromptVersion,
  updatePrompt
};
