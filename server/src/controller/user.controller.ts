import {
  Inject,
  Controller,
  Body,
  Get,
  Put,
  Del,
  Param,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/auth.service';
import { UpdateUserDTO } from '../dto/auth.dto';
import { RoleService } from '../service/role.service';

@Controller('/cgi/users')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  authService: AuthService;

  @Inject()
  roleService: RoleService;

  @Get('/')
  async getAllUsers() {
    try {
      const users = await this.authService.findAllUsers();
      return { success: true, data: users };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.authService.findUserById(id);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    try {
      const user = await this.authService.updateUser(id, data);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Del('/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.authService.deleteUser(id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/:id/roles')
  async assignRoles(
    @Param('id') id: string,
    @Body() data: { roleIds: string[] }
  ) {
    try {
      const user = await this.authService.assignRoles(id, data.roleIds);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
