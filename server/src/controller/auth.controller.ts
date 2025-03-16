import { Inject, Controller, Post, Body, Get, Put } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';
import { RegisterDTO, LoginDTO, UpdateUserDTO } from '../dto/auth.dto';

@Controller('/auth')
export class AuthController {
  @Inject()
  ctx: Context;

  @Inject()
  authService: AuthService;

  @Post('/register')
  async register(@Body() data: RegisterDTO) {
    try {
      const user = await this.authService.register(data);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    try {
      const result = await this.authService.login(data);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/user')
  async getCurrentUser() {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      const user = await this.authService.findUserById(userId);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/user')
  async updateUser(@Body() data: UpdateUserDTO) {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      const user = await this.authService.updateUser(userId, data);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
