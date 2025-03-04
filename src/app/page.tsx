import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <section className="mb-20">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent animate-fadeIn">你好，我是 Suyi Zhang 👋</h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed animate-slideUp">
          我是一名全栈开发工程师，热衷于创造优秀的用户体验和解决复杂的技术挑战。
        </p>
        <div className="flex gap-6 animate-slideUp" style={{animationDelay: '200ms'}}>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-primary hover:bg-primary-hover transform hover:scale-105 transition-all shadow-sm hover:shadow-md"
          >
            查看作品集
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transform hover:scale-105 transition-all shadow-sm hover:shadow-md"
          >
            阅读博客
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-8">技能专长</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-primary">前端开发</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">React, Next.js, TypeScript, Tailwind CSS</p>
          </div>
          <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-primary">后端开发</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">Node.js, Express, PostgreSQL, MongoDB</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold mb-8">最新项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-primary">个人网站</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              使用 Next.js 和 CSS-in-JS 构建的响应式个人网站，展示作品集和博客文章。
            </p>
          </div>
          <div className="p-8 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-primary">项目管理系统</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              基于 React 和 Node.js 的全栈项目管理系统，支持任务管理和团队协作。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}