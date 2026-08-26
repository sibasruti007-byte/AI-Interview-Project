const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.PORT, () => {
    logger.info(`🚀 InterviewAI Server running in [${config.NODE_ENV}] mode on port ${config.PORT}`);
    logger.info(`🔗 API URL: http://localhost:${config.PORT}/api`);
  });

  // Handle Unhandled Promise Rejections
  process.on('unhandledRejection', (err) => {
    logger.error(`UNHANDLED REJECTION! 💥 ${err.name}: ${err.message}`, { stack: err.stack });
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err) => {
    logger.error(`UNCAUGHT EXCEPTION! 💥 ${err.name}: ${err.message}`, { stack: err.stack });
    process.exit(1);
  });
};

startServer();
