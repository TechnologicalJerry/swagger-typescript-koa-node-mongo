import { Context, Next } from 'koa';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schemas: ValidationSchemas) => {
  return async (ctx: Context, next: Next) => {
    try {
      if (schemas.body) {
        (ctx.request as any).body = await schemas.body.parseAsync((ctx.request as any).body);
      }
      if (schemas.query) {
        ctx.query = await schemas.query.parseAsync(ctx.query);
      }
      if (schemas.params) {
        ctx.params = await schemas.params.parseAsync(ctx.params);
      }
      await next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw error; // Will be caught by error.middleware
      }
      throw new AppError('Validation failed', 400);
    }
  };
};
