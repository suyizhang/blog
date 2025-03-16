import {
  Inject,
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Del,
  Param,
} from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { PostService } from '../service/post.service';
import { CreatePostDTO, UpdatePostDTO, QueryPostDTO } from '../dto/post.dto';

@Controller('/blog/posts')
export class PostController {
  @Inject()
  ctx: Context;

  @Inject()
  postService: PostService;

  @Post('/')
  async createPost(@Body() data: CreatePostDTO) {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      const post = await this.postService.createPost(userId, data);
      return { success: true, data: post };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/:id')
  async updatePost(@Param('id') id: string, @Body() data: UpdatePostDTO) {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      const post = await this.postService.updatePost(id, userId, data);
      return { success: true, data: post };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Del('/:id')
  async deletePost(@Param('id') id: string) {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      await this.postService.deletePost(id, userId);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    try {
      const post = await this.postService.getPostById(id);
      return { success: true, data: post };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/')
  async queryPosts(@Query() query: QueryPostDTO) {
    try {
      const result = await this.postService.queryPosts(query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('/user/posts')
  async getUserPosts(@Query() query: QueryPostDTO) {
    try {
      const userId = this.ctx.state.user?.id;
      if (!userId) {
        throw new Error('未登录');
      }
      const result = await this.postService.getUserPosts(userId, query);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
