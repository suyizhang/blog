import { Provide } from '@midwayjs/core';
import { RoleModel, Permission } from '../entity/role.entity';

@Provide()
export class RoleService {
  async createRole(data: { name: string; description: string; permissions: Permission[] }) {
    const existingRole = await RoleModel.findOne({ name: data.name });
    if (existingRole) {
      throw new Error('角色名已存在');
    }

    const role = await RoleModel.create(data);
    return role;
  }

  async updateRole(id: string, data: { name?: string; description?: string; permissions?: Permission[] }) {
    const role = await RoleModel.findById(id);
    if (!role) {
      throw new Error('角色不存在');
    }

    if (data.name && data.name !== role.name) {
      const existingRole = await RoleModel.findOne({ name: data.name });
      if (existingRole) {
        throw new Error('角色名已存在');
      }
    }

    const updatedRole = await RoleModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    return updatedRole;
  }

  async deleteRole(id: string) {
    const role = await RoleModel.findById(id);
    if (!role) {
      throw new Error('角色不存在');
    }

    await RoleModel.findByIdAndDelete(id);
    return { success: true };
  }

  async getRoleById(id: string) {
    const role = await RoleModel.findById(id);
    if (!role) {
      throw new Error('角色不存在');
    }
    return role;
  }

  async getAllRoles() {
    return await RoleModel.find();
  }

  async assignPermissions(id: string, permissions: Permission[]) {
    const role = await RoleModel.findById(id);
    if (!role) {
      throw new Error('角色不存在');
    }

    role.permissions = permissions;
    await role.save();
    return role;
  }
}