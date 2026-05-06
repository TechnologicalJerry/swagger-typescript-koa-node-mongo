import { Context, Next } from 'koa';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
    
    // Handle 404
    if (ctx.status === 404 && !ctx.body) {
      throw new AppError('Route not found', 404);
    }
  } catch (err: any) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = undefined;

    // Handle Zod Validation Errors
    if (err instanceof ZodError) {
      statusCode = 400;
      message = 'Validation Error';
      errors = err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
    } else if (err.name === 'ValidationError') {
      // Mongoose validation error
      statusCode = 400;
      message = err.message;
    } else if (err.code === 11000) {
      // Mongoose duplicate key error
      statusCode = 409;
      message = 'Duplicate field value entered';
    }

    if (statusCode === 500) {
      logger.error('💥 Internal Server Error', err);
    }

    ctx.status = statusCode;
    ctx.body = {
      status: 'error',
      statusCode,
      message,
      ...(errors && { errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
  }
};
