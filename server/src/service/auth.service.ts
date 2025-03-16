import { Provide, Inject } from '@midwayjs/core';
import { UserModel } from '../entity/user.entity';
import { RegisterDTO, LoginDTO, UpdateUserDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@midwayjs/jwt';

@Provide()
export class AuthService {
  @Inject()
  jwtService: JwtService;

  async register(data: RegisterDTO) {
    const { username, email, password } = data;

    // 检查用户名和邮箱是否已存在
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      ...data,
      password: hashedPassword,
    });

    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async login(data: LoginDTO) {
    const { account, password } = data;

    // 查找用户
    const user = await UserModel.findOne({
      $or: [{ username: account }, { email: account }],
    }).select('+password');

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('密码错误');
    }

    // 生成 JWT token
    const token = await this.jwtService.sign({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return {
      token,
      user: userWithoutPassword,
    };
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('用户不存在');
    }

    // 如果更新密码，需要加密
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );

    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async findUserById(id: string) {
    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error('用户不存在');
    }

    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }
}
