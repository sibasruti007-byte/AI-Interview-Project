const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

// @route GET /api/users/me
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('activeResume');
  return ApiResponse.success(res, 200, 'Profile retrieved', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      activeResume: user.activeResume,
      stats: user.stats,
      profileCompletion: user.calculateProfileCompletion()
    }
  });
});

// @route PUT /api/users/me
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (req.body.name) user.name = req.body.name;

  const profileFields = [
    'avatar', 'phone', 'location', 'bio', 'college', 'degree',
    'graduationYear', 'experienceLevel', 'currentRole', 'targetRole',
    'skills', 'github', 'linkedin', 'portfolio'
  ];

  profileFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user.profile[field] = req.body[field];
    }
  });

  await user.save();

  return ApiResponse.success(res, 200, 'Profile updated successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: user.stats,
      profileCompletion: user.calculateProfileCompletion()
    }
  });
});

// @route POST /api/users/change-password
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 400));
  }

  user.password = newPassword;
  await user.save();

  await Notification.create({
    user: user._id,
    title: 'Password Changed',
    message: 'Your account password was updated successfully.',
    type: 'security_alert'
  });

  return ApiResponse.success(res, 200, 'Password updated successfully');
});

// @route DELETE /api/users/me
const deleteMyAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  return ApiResponse.success(res, 200, 'Account successfully deactivated');
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteMyAccount
};
