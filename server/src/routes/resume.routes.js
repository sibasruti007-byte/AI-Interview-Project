const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadResume } = require('../middleware/upload.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

router.use(protect);

router.post('/', uploadResume.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getResumes);
router.get('/:id', resumeController.getResumeById);
router.delete('/:id', resumeController.deleteResume);
router.post('/:id/analyze', aiLimiter, resumeController.analyzeResume);

module.exports = router;
