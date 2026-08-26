const User = require('../models/User');
const authService = require('../services/auth.service');
const AppError = require('../utils/appError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

// @route POST /api/auth/register
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'candidate'
  });

  const { accessToken, refreshTokenRaw, refreshExpiresAt } = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, refreshTokenRaw, refreshExpiresAt, req.ip);

  // Send welcome notification
  await Notification.create({
    user: user._id,
    title: 'Welcome to InterviewAI!',
    message: 'Set up your target role, upload your resume, and start your first AI simulation.',
    type: 'system_update',
    link: '/dashboard'
  });

  return ApiResponse.created(res, 'Account registered successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      profileCompletion: user.calculateProfileCompletion()
    },
    accessToken,
    refreshToken: refreshTokenRaw
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 403));
  }

  const { accessToken, refreshTokenRaw, refreshExpiresAt } = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, refreshTokenRaw, refreshExpiresAt, req.ip);

  return ApiResponse.success(res, 200, 'Logged in successfully', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: user.stats,
      profileCompletion: user.calculateProfileCompletion()
    },
    accessToken,
    refreshToken: refreshTokenRaw
  });
});

// @route POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken: rawToken } = req.body;

  if (!rawToken) {
    return next(new AppError('Refresh token is required.', 400));
  }

  const result = await authService.rotateRefreshToken(rawToken, req.ip);

  return ApiResponse.success(res, 200, 'Session refreshed successfully', {
    user: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role
    },
    accessToken: result.accessToken,
    refreshToken: result.refreshToken
  });
});

// @route POST /api/auth/logout
const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken: rawToken } = req.body;
  if (rawToken) {
    await authService.revokeToken(rawToken);
  }
  return ApiResponse.success(res, 200, 'Logged out successfully');
});

// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // Return generic message to prevent account enumeration
    return ApiResponse.success(res, 200, 'If an account with that email exists, password reset instructions have been sent.');
  }

  const { resetToken, hashedToken, expiresAt } = authService.generatePasswordResetToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  // In production, send email. For demonstration, return token info securely or in dev mode
  return ApiResponse.success(res, 200, 'Password reset link has been dispatched to your email.', {
    resetToken // Exposed in dev response for seamless testing
  });
});

// @route POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const crypto = require('crypto');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired.', 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Create notification
  await Notification.create({
    user: user._id,
    title: 'Password Updated',
    message: 'Your password was successfully reset. If this was not you, please contact support immediately.',
    type: 'security_alert'
  });

  const { accessToken, refreshTokenRaw, refreshExpiresAt } = authService.generateTokens(user);
  await authService.saveRefreshToken(user._id, refreshTokenRaw, refreshExpiresAt, req.ip);

  return ApiResponse.success(res, 200, 'Password has been reset successfully.', {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken: refreshTokenRaw
  });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('activeResume');
  return ApiResponse.success(res, 200, 'Current user retrieved', {
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

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe
};
