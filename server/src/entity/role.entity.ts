import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';

export enum Permission {
  CREATE_POST = 'create_post',
  EDIT_POST = 'edit_post',
  DELETE_POST = 'delete_post',
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_SETTINGS = 'manage_settings'
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'roles',
  },
})
export class Role {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ type: () => [String], enum: Permission, default: [] })
  permissions: Permission[];

  createdAt: Date;
  updatedAt: Date;
}

export const RoleModel = getModelForClass(Role);