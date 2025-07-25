import { prisma } from '../lib/prisma.js'
import { ProjectCategory, ProjectStatus, SkillLevel } from '@prisma/client'

async function main() {
  console.log('🌱 Starting database seeding...')

  // 清理现有数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    await prisma.analytics.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.blogPost.deleteMany()
    await prisma.project.deleteMany()
    await prisma.skill.deleteMany()
    await prisma.setting.deleteMany()
    await prisma.user.deleteMany()
    console.log('🧹 Cleaned existing data')
  }

  // 创建技能数据
  const skills = [
    { name: 'React', category: 'Frontend', level: SkillLevel.EXPERT, color: '#61DAFB', order: 1 },
    { name: 'TypeScript', category: 'Frontend', level: SkillLevel.EXPERT, color: '#3178C6', order: 2 },
    { name: 'JavaScript', category: 'Frontend', level: SkillLevel.EXPERT, color: '#F7DF1E', order: 3 },
    { name: 'Node.js', category: 'Backend', level: SkillLevel.ADVANCED, color: '#339933', order: 4 },
    { name: 'Express.js', category: 'Backend', level: SkillLevel.ADVANCED, color: '#000000', order: 5 },
    { name: 'PostgreSQL', category: 'Database', level: SkillLevel.INTERMEDIATE, color: '#336791', order: 6 },
    { name: 'Prisma', category: 'Database', level: SkillLevel.INTERMEDIATE, color: '#2D3748', order: 7 },
    { name: 'Tailwind CSS', category: 'Frontend', level: SkillLevel.ADVANCED, color: '#06B6D4', order: 8 },
    { name: 'Git', category: 'Tools', level: SkillLevel.ADVANCED, color: '#F05032', order: 9 },
    { name: 'Docker', category: 'Tools', level: SkillLevel.INTERMEDIATE, color: '#2496ED', order: 10 }
  ]

  for (const skill of skills) {
    await prisma.skill.create({ data: skill })
  }
  console.log(`✅ Created ${skills.length} skills`)

  // 创建示例项目数据
  const projects = [
    {
      title: 'Personal Website',
      description: 'A modern personal website built with React, TypeScript, and Node.js',
      content: 'This is a comprehensive personal website featuring a responsive design, dark/light theme toggle, project showcase, blog system, and contact form. Built with modern technologies and best practices.',
      technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'SQLite', 'Tailwind CSS']),
      githubUrl: 'https://github.com/yourusername/personal-website',
      liveUrl: 'https://yourname.dev',
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.COMPLETED,
      featured: true,
      views: 245,
      likes: 18,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-25')
    },
    {
      title: 'E-commerce Dashboard',
      description: 'Admin dashboard for e-commerce management with analytics and inventory tracking',
      content: 'A comprehensive admin dashboard built for e-commerce platforms. Features include real-time analytics, inventory management, order tracking, and customer management.',
      technologies: JSON.stringify(['React', 'TypeScript', 'Chart.js', 'Material-UI', 'Node.js']),
      githubUrl: 'https://github.com/yourusername/ecommerce-dashboard',
      category: ProjectCategory.FRONTEND,
      status: ProjectStatus.COMPLETED,
      featured: true,
      views: 189,
      likes: 24,
      startDate: new Date('2023-10-01'),
      endDate: new Date('2023-11-15')
    },
    {
      title: 'Task Management API',
      description: 'RESTful API for task management with authentication and real-time updates',
      content: 'A robust REST API built with Node.js and Express, featuring JWT authentication, real-time updates with WebSockets, and comprehensive task management capabilities.',
      technologies: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'JWT', 'WebSocket', 'Docker']),
      githubUrl: 'https://github.com/yourusername/task-api',
      category: ProjectCategory.BACKEND,
      status: ProjectStatus.COMPLETED,
      featured: false,
      views: 156,
      likes: 12,
      startDate: new Date('2023-08-01'),
      endDate: new Date('2023-09-20')
    },
    {
      title: 'Weather App',
      description: 'Mobile-responsive weather application with location-based forecasts',
      content: 'A beautiful weather application that provides current weather conditions and 7-day forecasts. Features location-based weather, interactive maps, and weather alerts.',
      technologies: JSON.stringify(['React', 'TypeScript', 'OpenWeather API', 'Geolocation API', 'PWA']),
      githubUrl: 'https://github.com/yourusername/weather-app',
      liveUrl: 'https://weather.yourname.dev',
      category: ProjectCategory.FRONTEND,
      status: ProjectStatus.COMPLETED,
      featured: false,
      views: 98,
      likes: 8,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-06-30')
    },
    {
      title: 'Chat Application',
      description: 'Real-time chat application with rooms and file sharing',
      content: 'A modern real-time chat application built with Socket.io. Features include chat rooms, private messaging, file sharing, emoji support, and user presence indicators.',
      technologies: JSON.stringify(['React', 'Node.js', 'Socket.io', 'MongoDB', 'Cloudinary', 'JWT']),
      githubUrl: 'https://github.com/yourusername/chat-app',
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.IN_PROGRESS,
      featured: true,
      views: 67,
      likes: 15,
      startDate: new Date('2024-01-15')
    },
    {
      title: 'Blog CMS',
      description: 'Content management system for blogs with markdown support',
      content: 'A headless CMS specifically designed for blogs and content creators. Features markdown editing, media management, SEO optimization, and multi-author support.',
      technologies: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Markdown', 'AWS S3']),
      githubUrl: 'https://github.com/yourusername/blog-cms',
      category: ProjectCategory.FULLSTACK,
      status: ProjectStatus.PLANNING,
      featured: false,
      views: 23,
      likes: 3,
      startDate: new Date('2024-02-01')
    }
  ]

  // 注意：这里我们不创建用户，因为用户会通过GitHub OAuth创建
  // 但我们可以创建项目数据，稍后可以关联到用户
  console.log('📝 Projects will be created when users authenticate via GitHub OAuth')

  // 创建网站设置
  const settings = [
    { key: 'site_title', value: 'Your Name - Full Stack Developer', type: 'STRING' },
    { key: 'site_description', value: 'Personal website showcasing projects and skills', type: 'STRING' },
    { key: 'contact_email', value: 'your.email@example.com', type: 'STRING' },
    { key: 'github_username', value: 'yourusername', type: 'STRING' },
    { key: 'linkedin_url', value: 'https://linkedin.com/in/yourusername', type: 'STRING' },
    { key: 'twitter_url', value: 'https://twitter.com/yourusername', type: 'STRING' },
    { key: 'resume_url', value: 'https://yourname.dev/resume.pdf', type: 'STRING' },
    { key: 'analytics_enabled', value: 'true', type: 'BOOLEAN' },
    { key: 'max_projects_per_page', value: '6', type: 'NUMBER' }
  ]

  for (const setting of settings) {
    await prisma.setting.create({
      data: {
        key: setting.key,
        value: setting.value,
        type: setting.type as any
      }
    })
  }
  console.log(`⚙️ Created ${settings.length} settings`)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   • ${skills.length} skills created`)
  console.log(`   • ${settings.length} settings created`)
  console.log('   • Projects will be created when users authenticate')
  console.log('\n🚀 Your personal website database is ready!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })