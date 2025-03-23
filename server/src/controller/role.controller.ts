import { Inject, Controller, Post, Body, Get, Put, Del, Param } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RoleService } from '../service/role.service';
import { Permission } from '../entity/role.entity';

@Controller('/cgi/admin/roles')
export class RoleController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;

  @Post('/')
  async createRole(@Body() data: { name: string; description: string; permissions: Permission[] }) {
    try {
      const role = await this.roleService.createRole(data);
      return { success: true, data: role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() data: { name?: string; description?: string; permissions?: Permission[] }
  ) {
    try {
      const role = await this.roleService.updateRole(id, data);
      return { success: true, data: role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Del('/:id')
  async deleteRole(@Param('id') id: string) {
    try {
      await this.roleService.deleteRole(id);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/:id')
  async getRole(@Param('id') id: string) {
    try {
      const role = await this.roleService.getRoleById(id);
      return { success: true, data: role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/')
  async getAllRoles() {
    try {
      const roles = await this.roleService.getAllRoles();
      return { success: true, data: roles };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/:id/permissions')
  async assignPermissions(
    @Param('id') id: string,
    @Body() data: { permissions: Permission[] }
  ) {
    try {
      const role = await this.roleService.assignPermissions(id, data.permissions);
      return { success: true, data: role };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}