const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // Handle frontend dev mock token
  if (token.startsWith('dev_mock_token_')) {
    const isAdmin = token.includes('admin');
    req.user = {
      _id: isAdmin ? '6a78616ee67c00a12fd30f01' : '6a78616fe67c00a12fd30f03',
      id: isAdmin ? '6a78616ee67c00a12fd30f01' : '6a78616fe67c00a12fd30f03',
      name: isAdmin ? 'Super Admin' : 'Alex Rivera',
      email: isAdmin ? 'admin@interviewai.com' : 'candidate@interviewai.com',
      role: isAdmin ? 'admin' : 'candidate',
      isActive: true,
      profile: {
        targetRole: 'Full Stack Developer',
        skills: ['React', 'Node.js', 'Express', 'MongoDB']
      },
      stats: { totalInterviews: 10, completedInterviews: 8, averageScore: 85 },
      calculateProfileCompletion: () => 90,
      _isMock: true
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

    // If MongoDB is offline or user not in DB (mock user)
    if (mongoose.connection.readyState !== 1) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.role === 'admin' ? 'Super Admin' : 'Alex Rivera',
        isActive: true,
        calculateProfileCompletion: () => 90,
        _isMock: true
      };
      return next();
    }

    const currentUser = await User.findById(decoded.id).select('+password');

    if (!currentUser) {
      // If token belongs to demo candidate/admin but record was removed from DB
      if (decoded.email === 'admin@interviewai.com' || decoded.email === 'candidate@interviewai.com') {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.role === 'admin' ? 'Super Admin' : 'Alex Rivera',
          isActive: true,
          calculateProfileCompletion: () => 90,
          _isMock: true
        };
        return next();
      }
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (!currentUser.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 403));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your session token has expired. Please refresh your session.', 401));
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

module.exports = { protect };
