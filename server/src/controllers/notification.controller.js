const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/notifications
const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  return ApiResponse.success(res, 200, 'Notifications retrieved', {
    notifications,
    unreadCount
  });
});

// @route PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res, next) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true }
  );
  return ApiResponse.success(res, 200, 'Notification marked as read');
});

// @route PATCH /api/notifications/mark-all-read
const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  return ApiResponse.success(res, 200, 'All notifications marked as read');
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
