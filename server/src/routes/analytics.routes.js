const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/performance', analyticsController.getPerformanceAnalytics);

module.exports = router;
