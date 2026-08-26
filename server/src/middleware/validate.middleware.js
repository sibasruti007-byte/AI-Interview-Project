const { ZodError } = require('zod');
const AppError = require('../utils/appError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    // Assign parsed data back
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue) => ({
        field: issue.path.join('.').replace(/^(body|query|params)\./, ''),
        message: issue.message
      }));
      return next(new AppError('Validation failed', 400, errorMessages));
    }
    next(error);
  }
};

module.exports = validate;
