import { Controller, Get, Post, Put, Del, Query, Param, Body, Files, Fields } from '@midwayjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { BlogService } from '../service/blog.service';

@Controller('/api/blog')
export class BlogController {
  constructor(private blogService: BlogService) { }

  @Get('/posts')
  async getPosts(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('category') category?: string,
    @Query('tag') tag?: string
  ) {
    const posts = await this.blogService.getPosts({
      page: Number(page),
      pageSize: Number(pageSize),
      category,
      tag,
    });
    return { success: true, data: posts };
  }

  @Get('/posts/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    const post = await this.blogService.getPostBySlug(slug);
    if (!post) {
      return { success: false, message: '文章不存在' };
    }
    return { success: true, data: post };
  }

  @Post('/posts')
  async createPost(@Body() post: {
    title: string;
    content: string;
    slug: string;
    category?: string;
    tags?: string[];
    published?: boolean;
  }) {
    const newPost = await this.blogService.createPost(post);
    return { success: true, data: newPost };
  }

  @Put('/posts/:slug')
  async updatePost(@Param('slug') slug: string, @Body() post: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
    published?: boolean;
  }) {
    const updatedPost = await this.blogService.updatePost({ slug, ...post });
    if (!updatedPost) {
      return { success: false, message: '文章不存在' };
    }
    return { success: true, data: updatedPost };
  }

  @Del('/posts/:slug')
  async deletePost(@Param('slug') slug: string) {
    const success = await this.blogService.deletePost(slug);
    if (!success) {
      return { success: false, message: '删除文章失败' };
    }
    return { success: true, message: '文章已删除' };
  }

  @Get('/categories')
  async getCategories() {
    const categories = await this.blogService.getCategories();
    return { success: true, data: categories };
  }

  @Get('/tags')
  async getTags() {
    const tags = await this.blogService.getTags();
    return { success: true, data: tags };
  }

  @Post('/upload')
  async uploadMarkdown(@Files() files: any[], @Fields() fields: any) {
    if (!files || files.length === 0) {
      return { success: false, message: '请选择要上传的Markdown文件' };
    }

    const file = files[0];
    if (!file.filename?.endsWith('.md')) {
      return { success: false, message: '只支持上传Markdown文件' };
    }

    try {
      const content = fs.readFileSync(file.data, 'utf-8');
      const title = fields.title || path.basename(file.filename, '.md');

      const post = await this.blogService.createPost({
        title,
        content,
        description: fields.description,
        category: fields.category,
        tags: fields.tags ? JSON.parse(fields.tags) : undefined,
        status: fields.status || 'draft'
      });

      return { success: true, data: post };
    } catch (error) {
      return { success: false, message: '文件上传失败：' + error.message };
    }
  }
}