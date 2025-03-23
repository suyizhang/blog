import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import { Role } from './role.entity';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users',
  },
})
export class User {
  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true, select: false })
  password: string;

  @prop()
  avatar?: string;

  @prop()
  bio?: string;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({ ref: () => Role })
  roles?: Ref<Role>[];

  @prop()
  resetPasswordToken?: string;

  @prop()
  resetPasswordExpires?: Date;

  @prop()
  githubId?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = getModelForClass(User);
