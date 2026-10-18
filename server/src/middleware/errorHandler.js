const logger = require('../utils/logger');

exports.notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
};

// Centralised error handler
exports.errorHandler = (err, req, res, next) => { // eslint-disable-line
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(', ')}`;
  } else if (err.name === 'MulterError') {
    status = 400;
  }

  if (status >= 500) logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`);
  else logger.warn(`${req.method} ${req.originalUrl} - ${status} - ${message}`);

  res.status(status).json({
    success: false,
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
    ...(process.env.NODE_ENV === 'development' && status >= 500 && { stack: err.stack }),
  });
};
