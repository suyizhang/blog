import { Inject, Controller, Post, Body } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { Context } from '@midwayjs/koa';

@Controller('/api/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    const { email, password, name } = body;
    const user = await this.userService.createUser({ email, password, name });
    return { code: 200, message: '注册成功', data: { id: user.id, email: user.email, name: user.name } };
  }

  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    const { user, token } = await this.userService.verifyUser(email, password);
    return { code: 200, message: '登录成功', data: { token, user: { id: user.id, email: user.email, name: user.name } } };
  }

  @Post('/update')
  async updateProfile(@Body() body: { name: string }) {
    const { name } = body;
    const userId = this.ctx.state.user.userId;
    const user = await this.userService.updateUser(userId, { name });
    return { code: 200, message: '更新成功', data: { id: user.id, email: user.email, name: user.name } };
  }

  @Post('/password')
  async updatePassword(@Body() body: { oldPassword: string; newPassword: string }) {
    const { oldPassword, newPassword } = body;
    const userId = this.ctx.state.user.userId;
    const user = await this.userService.updatePassword(userId, oldPassword, newPassword);
    return { code: 200, message: '密码修改成功', data: { id: user.id, email: user.email, name: user.name } };
  }
}