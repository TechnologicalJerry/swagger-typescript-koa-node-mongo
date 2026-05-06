import { Context } from 'koa';
import { userRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';
import { AppError } from '../utils/AppError';

export class UserController {
  async getAllUsers(ctx: Context) {
    const users = await UserModel.find().select('-password');
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      results: users.length,
      data: { users },
    };
  }

  async getUserById(ctx: Context) {
    const user = await userRepository.findById(ctx.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Convert to object and remove sensitive info if necessary
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: { user: userResponse },
    };
  }

  async updateProfile(ctx: Context) {
    // Only allow updating name and avatar
    const { name, avatar } = (ctx.request as any).body;
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      ctx.state.user.userId,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: { user: updatedUser },
    };
  }

  async deleteUser(ctx: Context) {
    const user = await UserModel.findByIdAndDelete(ctx.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    ctx.status = 204;
    ctx.body = null;
  }
}

export const userController = new UserController();
