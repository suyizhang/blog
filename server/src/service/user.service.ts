import { Provide } from '@midwayjs/core';
import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Provide()
export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(data: { email: string; password: string; name?: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async verifyUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('密码错误');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your-jwt-secret-key',
      { expiresIn: '2d' }
    );

    return { user, token };
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: { name?: string }): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('用户不存在');
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      throw new Error('原密码错误');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  }
}