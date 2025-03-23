import { Provide, Inject } from '@midwayjs/core';
import { UserModel } from '../entity/user.entity';
import { RegisterDTO, LoginDTO, UpdateUserDTO } from '../dto/auth.dto';
import {
  RequestResetPasswordDTO,
  ResetPasswordDTO,
} from '../dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@midwayjs/jwt';
import * as crypto from 'crypto';
import axios from 'axios';

@Provide()
export class AuthService {
  @Inject()
  jwtService: JwtService;

  async register(data: RegisterDTO) {
    const { username, email, password } = data;

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new Error('用户名或邮箱已存在');
    }

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

    const user = await UserModel.findOne({
      $or: [{ username: account }, { email: account }],
    })
      .select('+password')
      .populate('roles');

    if (!user) {
      throw new Error('用户不存在');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('密码错误');
    }

    const token = await this.jwtService.sign({
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      roles: user.roles,
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

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).populate('roles');

    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async findUserById(id: string) {
    const user = await UserModel.findById(id).populate('roles');

    if (!user) {
      throw new Error('用户不存在');
    }

    const userObject = user.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async requestPasswordReset(data: RequestResetPasswordDTO) {
    const { email } = data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('该邮箱未注册');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1小时有效期

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // TODO: 发送重置密码邮件
    return { success: true, message: '重置密码邮件已发送' };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const { token, newPassword } = data;
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('重置密码链接无效或已过期');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { success: true, message: '密码重置成功' };
  }

  async findAllUsers() {
    const users = await UserModel.find().populate('roles');
    return users.map(user => {
      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;
      return userWithoutPassword;
    });
  }

  async deleteUser(id: string) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('用户不存在');
    }

    await UserModel.findByIdAndDelete(id);
    return { success: true };
  }

  async assignRoles(userId: string, roleIds: string[]) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    user.roles = roleIds as any;
    await user.save();

    const updatedUser = await UserModel.findById(userId).populate('roles');
    const userObject = updatedUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;
    return userWithoutPassword;
  }

  async githubLogin(code: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    try {
      // 获取访问令牌
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // 获取用户信息
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const githubUser = userResponse.data;

      // 查找或创建用户
      let user = await UserModel.findOne({ githubId: githubUser.id });

      if (!user) {
        user = await UserModel.create({
          username: `github_${githubUser.login}`,
          email: githubUser.email || `${githubUser.id}@github.com`,
          password: crypto.randomBytes(16).toString('hex'),
          githubId: githubUser.id,
          avatar: githubUser.avatar_url,
        });
      }

      // 生成JWT令牌
      const token = await this.jwtService.sign({
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
        roles: user.roles,
      });

      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new Error('GitHub登录失败：' + error.message);
    }
  }
}
