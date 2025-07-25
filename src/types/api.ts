// API响应类型定义

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 项目相关类型
export interface Project {
  id: string
  title: string
  description: string
  content?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'other'
  status: 'planning' | 'in-progress' | 'completed' | 'archived'
  featured: boolean
  views: number
  likes: number
  startDate?: string
  endDate?: string
  userId?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectsResponse {
  success: boolean
  projects: Project[]
  total: number
  categories: string[]
  filters: Record<string, any>
}

// 用户相关类型
export interface User {
  id: string
  githubId?: string
  login: string
  email?: string
  name?: string
  bio?: string
  location?: string
  website?: string
  avatarUrl?: string
  company?: string
  title?: string
  skills?: string[]
  experience?: string
  education?: string
  followers: number
  following: number
  publicRepos: number
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserStats {
  totalProjects: number
  totalBlogPosts: number
  totalContacts: number
  totalViews: number
  totalLikes: number
  githubStats: {
    followers: number
    following: number
    publicRepos: number
  }
  recentActivity: Array<{
    type: string
    title: string
    date: string
  }>
}

// 技能相关类型
export interface Skill {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other'
  level: number
  description?: string
  iconUrl?: string
  color?: string
  order: number
}

// 联系表单类型
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactInfo {
  email: string
  phone?: string
  location?: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  availability: string
  responseTime: string
}

// 设置类型
export interface Setting {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
}

// 博客文章类型
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  likes: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}