const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, {
      autoIndex: true
    });
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    // Don't crash immediately in test or mock environments
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
