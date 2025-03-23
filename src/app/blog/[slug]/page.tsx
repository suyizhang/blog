import { getPostBySlug } from '../utils';
import { useBlogStore } from '../store';
import Link from 'next/link';
import Comments from '../../components/Comments';
import 'prismjs/themes/prism.css';
import './styles.css';


type tParams = Promise<{ slug: string }>;

export default async function BlogPost({ params }: { params: tParams }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 更新当前文章状态
  useBlogStore.setState({ currentPost: post });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center px-4 py-2 text-base font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 group"
        >
          <span className="mr-2 transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
          返回文章列表
        </Link>
      </div>
      <article className="prose prose-lg dark:prose-invert mx-auto !prose-headings:text-gray-900 !prose-headings:dark:text-gray-100 !prose-p:text-gray-700 !prose-p:dark:text-gray-300 !prose-code:text-gray-800 !prose-code:dark:text-gray-200 !prose-pre:bg-gray-50 !prose-pre:dark:bg-gray-900">
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">{post.title}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
            <time dateTime={post.date}>{post.date}</time>
            {post.category && (
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                {post.category}
              </span>
            )}
          </div>
        </header>
        <div
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-20 pt-10 border-t dark:border-gray-800">
            <div className="flex flex-wrap gap-3">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
      <Comments
        repo="Evansy/blog"
        repoId="R_kgDOLXXXXX"
        category="Announcements"
        categoryId="DIC_kwDOLXXXXXc"
      />
    </div>
  );
}