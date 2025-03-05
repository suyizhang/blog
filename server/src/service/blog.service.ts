import { Provide } from '@midwayjs/core';
import { BlogPost, BlogCategory, BlogTag, GetPostsParams, GetPostsResult, CreatePostParams, UpdatePostParams } from '../interface/blog.interface';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Prism from 'prismjs';

@Provide()
export class BlogService {
  private postsDirectory = path.join(process.cwd(), '../posts');
  private cache = {
    posts: new Map<string, BlogPost>(),
    categories: null as BlogCategory[] | null,
    tags: null as BlogTag[] | null,
  };

  async createPost(params: CreatePostParams): Promise<BlogPost> {
    const { title, content, description, tags, category, status = 'draft' } = params;
    const slug = this.generateSlug(title);
    const now = new Date().toISOString();

    const post: BlogPost = {
      slug,
      title,
      date: now,
      description: description || '',
      content,
      tags: tags || [],
      category,
      status,
      createdAt: now,
      updatedAt: now,
    };

    // 保存文章到文件系统
    const fullPath = path.join(this.postsDirectory, `${slug}.md`);
    const fileContent = matter.stringify(content, {
      title,
      date: now,
      description: description || '',
      tags: tags || [],
      category,
      status,
      createdAt: now,
      updatedAt: now,
    });

    fs.writeFileSync(fullPath, fileContent, 'utf8');

    // 更新缓存
    this.cache.posts.set(slug, post);
    this.cache.categories = null;
    this.cache.tags = null;

    return post;
  }

  async updatePost(params: UpdatePostParams): Promise<BlogPost | null> {
    const { slug, ...updateData } = params;
    const existingPost = await this.getPostBySlug(slug);

    if (!existingPost) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedPost: BlogPost = {
      ...existingPost,
      ...updateData,
      updatedAt: now,
    };

    // 更新文件系统
    const fullPath = path.join(this.postsDirectory, `${slug}.md`);
    const fileContent = matter.stringify(updatedPost.content, {
      title: updatedPost.title,
      date: updatedPost.date,
      description: updatedPost.description,
      tags: updatedPost.tags,
      category: updatedPost.category,
      status: updatedPost.status,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    });

    fs.writeFileSync(fullPath, fileContent, 'utf8');

    // 更新缓存
    this.cache.posts.set(slug, updatedPost);
    this.cache.categories = null;
    this.cache.tags = null;

    return updatedPost;
  }

  async deletePost(slug: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.postsDirectory, `${slug}.md`);
      fs.unlinkSync(fullPath);

      // 更新缓存
      this.cache.posts.delete(slug);
      this.cache.categories = null;
      this.cache.tags = null;

      return true;
    } catch (error) {
      return false;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async getPosts(params: GetPostsParams): Promise<GetPostsResult> {
    const { page, pageSize, category, tag } = params;
    let posts = await this.getAllPosts();

    // 根据分类和标签筛选
    if (category) {
      posts = posts.filter(post => post.category === category);
    }
    if (tag) {
      posts = posts.filter(post => post.tags?.includes(tag));
    }

    // 按日期降序排序
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));

    const total = posts.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedPosts = posts.slice(start, end);

    return {
      posts: paginatedPosts,
      total,
      page,
      pageSize,
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    // 检查缓存
    if (this.cache.posts.has(slug)) {
      return this.cache.posts.get(slug)!;
    }

    try {
      const fullPath = path.join(this.postsDirectory, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // 使用remark将markdown转换为HTML
      const processedContent = await remark()
        .use(html)
        .process(content);

      // 使用Prism处理代码高亮
      const htmlContent = processedContent.toString();
      const highlightedContent = htmlContent.replace(
        /<pre><code class="language-([^"]+)">(.*?)<\/code><\/pre>/g,
        (_, lang, code) => {
          const grammar = Prism.languages[lang] || Prism.languages.plaintext;
          const highlighted = Prism.highlight(code, grammar, lang);
          return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
        }
      );

      const post: BlogPost = {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        content: highlightedContent,
        tags: data.tags,
        category: data.category,
      };

      // 添加到缓存
      this.cache.posts.set(slug, post);
      return post;
    } catch (error) {
      return null;
    }
  }

  async getCategories(): Promise<BlogCategory[]> {
    if (this.cache.categories) {
      return this.cache.categories;
    }

    const posts = await this.getAllPosts();
    const categoryMap = new Map<string, number>();

    posts.forEach(post => {
      if (post.category) {
        categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
    }));

    this.cache.categories = categories;
    return categories;
  }

  async getTags(): Promise<BlogTag[]> {
    if (this.cache.tags) {
      return this.cache.tags;
    }

    const posts = await this.getAllPosts();
    const tagMap = new Map<string, number>();

    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const tags = Array.from(tagMap.entries()).map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
    }));

    this.cache.tags = tags;
    return tags;
  }

  private async getAllPosts(): Promise<BlogPost[]> {
    const fileNames = fs.readdirSync(this.postsDirectory);
    const posts = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          const slug = fileName.replace(/\.md$/, '');
          const post = await this.getPostBySlug(slug);
          return post!;
        })
    );

    return posts.filter(Boolean);
  }
}