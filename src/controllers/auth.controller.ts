import { Context } from 'koa';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(ctx: Context) {
    const result = await authService.register((ctx.request as any).body);
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: result,
    };
  }

  async login(ctx: Context) {
    const { email, password } = (ctx.request as any).body;
    const result = await authService.login(email, password);
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: result,
    };
  }

  async refreshToken(ctx: Context) {
    const { refreshToken } = (ctx.request as any).body;
    const result = await authService.refreshToken(refreshToken);
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: result,
    };
  }

  async logout(ctx: Context) {
    // Assuming requireAuth middleware sets ctx.state.user
    const userId = ctx.state.user.userId;
    await authService.logout(userId);
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: 'Logged out successfully',
    };
  }

  async getProfile(ctx: Context) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: {
        user: ctx.state.user,
      },
    };
  }
}

export const authController = new AuthController();
