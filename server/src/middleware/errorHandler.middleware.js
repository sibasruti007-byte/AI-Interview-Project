const config = require('../config/env');
const logger = require('../utils/logger');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue ? err.keyValue[field] : 'value';
  const message = `Duplicate value '${value}' for field '${field}'. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message
  }));
  return new AppError('Invalid input data.', 400, errors);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;

  // Log error
  logger.error(`[${req.method} ${req.originalUrl}] - ${err.message}`, {
    stack: err.stack,
    statusCode: err.statusCode
  });

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  const responsePayload = {
    success: false,
    message: error.message || 'Internal Server Error'
  };

  if (error.errors && error.errors.length > 0) {
    responsePayload.errors = error.errors;
  }

  if (config.NODE_ENV === 'development') {
    responsePayload.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(responsePayload);
};

module.exports = errorHandler;
