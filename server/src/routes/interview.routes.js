const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const { createInterviewSchema, submitAnswerSchema } = require('../validators/interview.validator');

router.use(protect);

router.post('/', aiLimiter, validate(createInterviewSchema), interviewController.createInterview);
router.get('/', interviewController.getInterviews);
router.get('/:id', interviewController.getInterviewById);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/answers', aiLimiter, validate(submitAnswerSchema), interviewController.submitAnswer);
router.post('/:id/finish', aiLimiter, interviewController.finishInterview);
router.get('/:id/report', interviewController.getInterviewReport);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
