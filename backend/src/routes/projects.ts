import express, { Request, Response } from 'express'
import { optionalAuth, AuthRequest } from '../middleware/auth.js'

const router = express.Router()

// 项目数据（实际项目中应该从数据库获取）
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    category: 'fullstack',
    featured: true,
    status: 'completed',
    startDate: '2023-01-15',
    endDate: '2023-03-20',
    views: 245,
    likes: 18
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    technologies: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com/yourusername/taskmanager',
    liveUrl: 'https://taskmanager-demo.com',
    category: 'frontend',
    featured: true,
    status: 'completed',
    startDate: '2023-04-01',
    endDate: '2023-05-15',
    views: 189,
    likes: 24
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities with beautiful visualizations.',
    technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API'],
    githubUrl: 'https://github.com/yourusername/weather',
    liveUrl: 'https://weather-demo.com',
    category: 'frontend',
    featured: false,
    status: 'completed',
    startDate: '2023-06-01',
    endDate: '2023-06-20',
    views: 156,
    likes: 12
  },
  {
    id: 4,
    title: 'REST API Server',
    description: 'A robust REST API server with authentication, rate limiting, and comprehensive documentation. Built with Node.js and Express.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    githubUrl: 'https://github.com/yourusername/api-server',
    liveUrl: 'https://api-demo.com/docs',
    category: 'backend',
    featured: false,
    status: 'completed',
    startDate: '2023-07-01',
    endDate: '2023-08-10',
    views: 134,
    likes: 15
  },
  {
    id: 5,
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with React and TypeScript. Features dark mode, animations, and optimized performance.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://portfolio-demo.com',
    category: 'frontend',
    featured: true,
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-10-15',
    views: 312,
    likes: 28
  },
  {
    id: 6,
    title: 'Chat Application',
    description: 'Real-time chat application with multiple rooms, file sharing, and emoji support. Built with Socket.io and React.',
    technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/yourusername/chat-app',
    liveUrl: 'https://chat-demo.com',
    category: 'fullstack',
    featured: false,
    status: 'in-progress',
    startDate: '2023-11-01',
    endDate: null,
    views: 89,
    likes: 7
  }
]

// 获取所有项目
router.get('/', optionalAuth, (req: any, res: Response) => {
  try {
    const { category, featured, status, limit } = req.query

    let filteredProjects = [...projects]

    // 按分类筛选
    if (category && category !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.category === category)
    }

    // 按特色项目筛选
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(p => p.featured)
    }

    // 按状态筛选
    if (status) {
      filteredProjects = filteredProjects.filter(p => p.status === status)
    }

    // 限制数量
    if (limit) {
      filteredProjects = filteredProjects.slice(0, parseInt(limit as string))
    }

    // 按日期排序（最新的在前）
    filteredProjects.sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    res.json({
      success: true,
      projects: filteredProjects,
      total: filteredProjects.length,
      categories: ['frontend', 'backend', 'fullstack'],
      filters: { category, featured, status, limit }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve projects'
    })
  }
})

// 获取单个项目详情
router.get('/:id', optionalAuth, (req: any, res: Response) => {
  try {
    const projectId = parseInt(req.params.id || '0')
    const project = projects.find(p => p.id === projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `Project with ID ${projectId} does not exist`
      })
    }

    // 增加浏览量（实际项目中应该更新数据库）
    project.views += 1

    res.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve project details'
    })
  }
})

// 获取项目统计信息
router.get('/stats/summary', optionalAuth, (req: any, res: Response) => {
  try {
    const stats = {
      total: projects.length,
      completed: projects.filter(p => p.status === 'completed').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      featured: projects.filter(p => p.featured).length,
      totalViews: projects.reduce((sum, p) => sum + p.views, 0),
      totalLikes: projects.reduce((sum, p) => sum + p.likes, 0),
      categories: {
        frontend: projects.filter(p => p.category === 'frontend').length,
        backend: projects.filter(p => p.category === 'backend').length,
        fullstack: projects.filter(p => p.category === 'fullstack').length
      },
      technologies: getTopTechnologies(),
      recentProjects: projects
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 3)
        .map(p => ({ id: p.id, title: p.title, startDate: p.startDate }))
    }

    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Get project stats error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve project statistics'
    })
  }
})

// 获取热门技术栈
const getTopTechnologies = () => {
  const techCount: { [key: string]: number } = {}

  projects.forEach(project => {
    project.technologies.forEach(tech => {
      techCount[tech] = (techCount[tech] || 0) + 1
    })
  })

  return Object.entries(techCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tech, count]) => ({ name: tech, count }))
}

export default router