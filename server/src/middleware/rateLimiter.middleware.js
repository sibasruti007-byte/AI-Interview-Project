const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in 15 minutes.'
  }
});

// Stricter rate limiter for auth routes (brute-force defense)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.'
  }
});

// Dedicated AI rate limiter to protect compute / token usage
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 AI generations per 10 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI rate limit reached. Please wait a few minutes before submitting further AI evaluations.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter
};
