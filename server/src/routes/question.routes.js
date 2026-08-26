const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const { evaluatePracticeSchema } = require('../validators/interview.validator');

// Public / Semi-public metadata
router.get('/categories', questionController.getPublicCategories);
router.get('/job-roles', questionController.getPublicJobRoles);

// Protected routes
router.use(protect);
router.get('/', questionController.getQuestions);
router.get('/practice/random', questionController.getRandomPracticeQuestion);
router.post('/practice/evaluate', aiLimiter, validate(evaluatePracticeSchema), questionController.evaluatePracticeAnswer);
router.get('/:id', questionController.getQuestionById);

module.exports = router;
