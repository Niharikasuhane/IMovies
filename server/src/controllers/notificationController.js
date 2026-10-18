const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

exports.getMine = asyncHandler(async (req, res) => {
  const data = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
  res.json({ success: true, data, unread: data.filter((n) => !n.read).length });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ success: true });
});
