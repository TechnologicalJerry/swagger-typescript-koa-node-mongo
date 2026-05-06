import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const requireAuth = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (error) {
    throw new AppError('Not authorized, invalid token', 401);
  }
};

export const requireRole = (roles: string[]) => {
  return async (ctx: Context, next: Next) => {
    if (!ctx.state.user || !roles.includes(ctx.state.user.role)) {
      throw new AppError('Forbidden, insufficient role', 403);
    }
    await next();
  };
};
