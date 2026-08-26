const analyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/analytics/dashboard
const getDashboardAnalytics = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getCandidateDashboardAnalytics(req.user._id);
  return ApiResponse.success(res, 200, 'Candidate analytics retrieved', data);
});

// @route GET /api/analytics/performance
const getPerformanceAnalytics = asyncHandler(async (req, res, next) => {
  const data = await analyticsService.getCandidateDashboardAnalytics(req.user._id);
  return ApiResponse.success(res, 200, 'Performance analytics retrieved', data);
});

module.exports = {
  getDashboardAnalytics,
  getPerformanceAnalytics
};
