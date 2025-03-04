import Link from "next/link";

export default function Home() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-6">你好，我是 Suyi Zhang 👋</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          我是一名全栈开发工程师，热衷于创造优秀的用户体验和解决复杂的技术挑战。
        </p>
        <div className="flex gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            查看作品集
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
          >
            阅读博客
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">技能专长</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">前端开发</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">React, Next.js, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-6 border rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">后端开发</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Node.js, Express, PostgreSQL, MongoDB</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">最新项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">个人网站</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              使用 Next.js 和 Tailwind CSS 构建的响应式个人网站，展示作品集和博客文章。
            </p>
          </div>
          <div className="p-6 border rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">项目管理系统</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              基于 React 和 Node.js 的全栈项目管理系统，支持任务管理和团队协作。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}