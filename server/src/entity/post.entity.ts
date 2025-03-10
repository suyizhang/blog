import {
  prop,
  modelOptions,
  getModelForClass,
  Ref,
} from '@typegoose/typegoose';
import { User } from './user.entity';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'posts',
  },
})
export class Post {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  content: string;

  @prop()
  coverImage?: string;

  @prop({ type: () => [String] })
  tags?: string[];

  @prop({ default: 0 })
  viewCount: number;

  @prop({ default: false })
  isPublished: boolean;

  @prop({ ref: () => User, required: true })
  author: Ref<User>;

  createdAt: Date;
  updatedAt: Date;
}

export const PostModel = getModelForClass(Post);
