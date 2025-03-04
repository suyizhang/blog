import React from "react";
import Link from "next/link";
import { useBlogStore } from './store';

export default async function Blog() {
  await useBlogStore.getState().fetchPosts();
  const posts = useBlogStore.getState().posts;

  return (
    <div className="container max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-20 text-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent tracking-tight animate-fade-in">博客</h1>
      <div className="grid grid-cols-1 gap-12 animate-slide-up" style={{ animationDelay: "200ms" }}>
        {posts.map((post) => (
          <article key={post.slug} className="group p-10 border rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{post.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-10 leading-7 tracking-wide">
              {post.description}
            </p>
            <div>
              <footer className="flex items-center justify-between border-t dark:border-gray-800 pt-8">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{post.date}</span>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors group-hover:translate-x-1 duration-300">
                  阅读更多 <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}