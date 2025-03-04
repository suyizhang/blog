export default function About() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">关于我</h1>
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">个人简介</h2>
          <p className="text-gray-600 dark:text-gray-300">
            我是一名充满热情的全栈开发工程师，专注于创建高质量的Web应用和解决方案。我热衷于学习新技术，并将其应用到实际项目中。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">联系方式</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>邮箱：contact@example.com</li>
            <li>GitHub：github.com/username</li>
            <li>Twitter：@username</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">工作经历</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">高级开发工程师</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">某科技公司 | 2020 - 至今</p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                <li>负责核心业务系统的开发和维护</li>
                <li>优化系统性能，提升用户体验</li>
                <li>指导初级开发人员，推动团队技术成长</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}