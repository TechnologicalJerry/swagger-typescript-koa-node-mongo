import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
