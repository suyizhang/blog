import { PrismaClient, SkillLevel, ProjectCategory, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建种子数据...')

  // 创建技能数据
  const skills = [
    { name: 'React', level: SkillLevel.EXPERT, category: 'frontend', color: '#61DAFB', order: 1 },
    { name: 'TypeScript', level: SkillLevel.EXPERT, category: 'frontend', color: '#3178C6', order: 2 },
    { name: 'JavaScript', level: SkillLevel.EXPERT, category: 'frontend', color: '#F7DF1E', order: 3 },
    { name: 'HTML/CSS', level: SkillLevel.EXPERT, category: 'frontend', color: '#E34F26', order: 4 },
    { name: 'Tailwind CSS', level: SkillLevel.ADVANCED, category: 'frontend', color: '#06B6D4', order: 5 },
    { name: 'Node.js', level: SkillLevel.ADVANCED, category: 'backend', color: '#339933', order: 6 },
    { name: 'Express', level: SkillLevel.ADVANCED, category: 'backend', color: '#000000', order: 7 },
    { name: 'PostgreSQL', level: SkillLevel.INTERMEDIATE, category: 'database', color: '#336791', order: 8 },
    { name: 'Git', level: SkillLevel.ADVANCED, category: 'tools', color: '#F05032', order: 9 },
    { name: 'Docker', level: SkillLevel.INTERMEDIATE, category: 'tools', color: '#2496ED', order: 10 }
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill
    })
  }

  // 创建网站设置
  const settings = [
    { key: 'site_title', value: '张三 - 全栈开发工程师', type: 'STRING' },
    { key: 'site_description', value: '专注于现代Web开发技术的全栈工程师', type: 'STRING' },
    { key: 'contact_email', value: 'contact@example.com', type: 'STRING' },
    { key: 'github_username', value: 'yourusername', type: 'STRING' },
    { key: 'linkedin_url', value: 'https://linkedin.com/in/yourusername', type: 'STRING' },
    { key: 'twitter_url', value: 'https://twitter.com/yourusername', type: 'STRING' },
    { key: 'resume_url', value: '/resume.pdf', type: 'STRING' },
    { key: 'analytics_enabled', value: 'true', type: 'BOOLEAN' }
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        type: setting.type as any
      }
    })
  }

  console.log('种子数据创建完成！')
  console.log(`创建了 ${skills.length} 个技能`)
  console.log(`创建了 ${settings.length} 个网站设置`)
  console.log('注意：项目和博客文章需要用户登录后才能创建')
}

main()
  .catch((e) => {
    console.error('种子数据创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })