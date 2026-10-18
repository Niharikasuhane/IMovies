const Notification = require('../models/Notification');

module.exports = async (userId, title, message, type = 'info') =>
  Notification.create({ user: userId, title, message, type });
