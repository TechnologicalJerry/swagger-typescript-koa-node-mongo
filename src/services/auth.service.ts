import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { IUser } from '../models/user.model';

interface TokenPayload {
  userId: string;
  role: string;
}

export class AuthService {
  private generateTokens(user: IUser) {
    const payload: TokenPayload = { userId: String(user._id), role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
  }

  async register(userData: Partial<IUser>) {
    const existingUser = await userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await userRepository.create(userData);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const tokens = this.generateTokens(user);
    await userRepository.updateRefreshToken(String(user._id), tokens.refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, ...tokens };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
      
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Check if refresh token in DB matches the provided one
      // Since we don't return the refreshToken in normal queries, we need to fetch it explicitly
      const userWithToken = await user.model('User').findById(user._id).select('+refreshToken');
      if (!userWithToken || (userWithToken as any).refreshToken !== token) {
         throw new AppError('Invalid refresh token', 401);
      }

      const tokens = this.generateTokens(user);
      await userRepository.updateRefreshToken(String(user._id), tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }
}

export const authService = new AuthService();
