const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = async function connectDB(uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies') {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    if (logger && logger.info) {
      logger.info(`Connected to MongoDB: ${mongoose.connection.host}`);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
