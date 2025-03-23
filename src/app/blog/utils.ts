'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Prism from 'prismjs';
import { BlogPost } from './types';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getAllPosts(): Promise<BlogPost[]> {
  // 确保posts目录存在
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const slug = fileName.replace(/\.md$/, '');
        return await getPostBySlug(slug);
      })
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');

  // 使用gray-matter解析markdown文件的front matter
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

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    content: highlightedContent,
    tags: data.tags,
    category: data.category,
  };
}

export async function getAllCategories() {
  const posts = await Promise.all(
    fs.readdirSync(postsDirectory)
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const fileContents = await fs.promises.readFile(
          path.join(postsDirectory, fileName),
          'utf8'
        );
        const { data } = matter(fileContents);
        return data.category;
      })
  );

  const categories = posts.filter(Boolean);
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    count,
  }))
}

export async function getAllTags() {
  const posts = await Promise.all(
    fs.readdirSync(postsDirectory)
      .filter(fileName => fileName.endsWith('.md'))
      .map(async fileName => {
        const fileContents = await fs.promises.readFile(
          path.join(postsDirectory, fileName),
          'utf8'
        );
        const { data } = matter(fileContents);
        return data.tags || [];
      })
  );

  const tags = posts.flat();
  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(tagCounts).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    count,
  }));
}