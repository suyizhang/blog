import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';

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

  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = getModelForClass(User);
