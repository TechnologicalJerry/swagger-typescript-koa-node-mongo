import { UserModel, IUser } from '../models/user.model';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select('+password');
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken });
  }
}

export const userRepository = new UserRepository();
