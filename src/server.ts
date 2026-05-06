import { app } from './app';
import { env } from './config/env';
import { connectDB } from './database/connection';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Koa server
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📚 Swagger Docs available at http://localhost:${env.PORT}/api/docs`);
    });
  } catch (error) {
    logger.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
