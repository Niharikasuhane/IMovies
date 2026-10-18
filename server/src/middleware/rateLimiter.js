const rateLimit = require('express-rate-limit');

const make = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max: process.env.NODE_ENV === 'test' ? 10000 : max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });

exports.apiLimiter = make(15 * 60 * 1000, 300, 'Too many requests, please try again later.');
exports.authLimiter = make(15 * 60 * 1000, 20, 'Too many login attempts, please try again in 15 minutes.');
exports.bookingLimiter = make(60 * 1000, 30, 'Too many booking requests, slow down.');
