import { Provide } from '@midwayjs/core';
import { PostModel } from '../entity/post.entity';
import { CreatePostDTO, UpdatePostDTO, QueryPostDTO } from '../dto/post.dto';
import { Types } from 'mongoose';

@Provide()
export class PostService {
  async createPost(authorId: string, data: CreatePostDTO) {
    const post = await PostModel.create({
      ...data,
      author: authorId,
    });
    return post;
  }

  async updatePost(id: string, authorId: string, data: Partial<UpdatePostDTO>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('无效的文章ID');
    }

    const post = await PostModel.findOne({
      _id: id,
      author: authorId,
    });

    if (!post) {
      throw new Error('文章不存在或无权限修改');
    }

    Object.assign(post, data);
    return await post.save();
  }

  async deletePost(id: string, authorId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('无效的文章ID');
    }

    const result = await PostModel.deleteOne({ _id: id, author: authorId });
    if (result.deletedCount === 0) {
      throw new Error('文章不存在或无权限删除');
    }
    return true;
  }

  async getPostById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('无效的文章ID');
    }

    const post = await PostModel.findById(id).populate('author');

    if (!post) {
      throw new Error('文章不存在');
    }

    // 增加浏览次数
    post.viewCount += 1;
    await post.save();

    return post;
  }

  async queryPosts(query: QueryPostDTO) {
    const { page = 1, pageSize = 10, keyword, tags, isPublished } = query;

    const filter: any = {};

    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (typeof isPublished === 'boolean') {
      filter.isPublished = isPublished;
    }

    const [posts, total] = await Promise.all([
      PostModel.find(filter)
        .populate('author')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      PostModel.countDocuments(filter),
    ]);

    return {
      items: posts,
      total,
      page,
      pageSize,
    };
  }

  async getUserPosts(authorId: string, query: QueryPostDTO) {
    const { page = 1, pageSize = 10 } = query;

    const [posts, total] = await Promise.all([
      PostModel.find({ author: authorId })
        .populate('author')
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      PostModel.countDocuments({ author: authorId }),
    ]);

    return {
      items: posts,
      total,
      page,
      pageSize,
    };
  }
}
