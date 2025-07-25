import { prisma } from '../lib/prisma.js'
import { Project, ProjectCategory, ProjectStatus, Prisma } from '@prisma/client'

export class ProjectService {
  // 获取所有项目（支持筛选）
  static async getProjects(filters: {
    category?: ProjectCategory
    featured?: boolean
    status?: ProjectStatus
    userId?: string
    limit?: number
    offset?: number
  } = {}) {
    try {
      const where: Prisma.ProjectWhereInput = {}

      if (filters.category) {
        where.category = filters.category
      }

      if (filters.featured !== undefined) {
        where.featured = filters.featured
      }

      if (filters.status) {
        where.status = filters.status
      }

      if (filters.userId) {
        where.userId = filters.userId
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                login: true,
                name: true,
                avatarUrl: true
              }
            }
          },
          orderBy: [
            { featured: 'desc' },
            { createdAt: 'desc' }
          ],
          ...(filters.limit && { take: filters.limit }),
          ...(filters.offset && { skip: filters.offset })
        }),
        prisma.project.count({ where })
      ])

      return {
        projects,
        total,
        hasMore: filters.limit ? (filters.offset || 0) + filters.limit < total : false
      }
    } catch (error) {
      console.error('Error getting projects:', error)
      throw new Error('Failed to get projects')
    }
  }

  // 获取单个项目
  static async getProjectById(id: string, incrementView = false): Promise<Project | null> {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              login: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      })

      // 增加浏览量
      if (project && incrementView) {
        await prisma.project.update({
          where: { id },
          data: { views: { increment: 1 } }
        })
        project.views += 1
      }

      return project
    } catch (error) {
      console.error('Error getting project by ID:', error)
      return null
    }
  }

  // 创建项目
  static async createProject(userId: string, data: Omit<Prisma.ProjectCreateInput, 'user'>): Promise<Project> {
    try {
      return await prisma.project.create({
        data: {
          ...data,
          user: {
            connect: { id: userId }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              login: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project')
    }
  }

  // 更新项目
  static async updateProject(id: string, userId: string, data: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>): Promise<Project> {
    try {
      // 确保只有项目所有者可以更新
      const existingProject = await prisma.project.findFirst({
        where: { id, userId }
      })

      if (!existingProject) {
        throw new Error('Project not found or access denied')
      }

      return await prisma.project.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              login: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error updating project:', error)
      throw new Error('Failed to update project')
    }
  }

  // 删除项目
  static async deleteProject(id: string, userId: string): Promise<boolean> {
    try {
      const result = await prisma.project.deleteMany({
        where: { id, userId }
      })

      return result.count > 0
    } catch (error) {
      console.error('Error deleting project:', error)
      throw new Error('Failed to delete project')
    }
  }

  // 切换项目点赞状态
  static async toggleLike(id: string): Promise<Project> {
    try {
      const project = await prisma.project.findUnique({
        where: { id }
      })

      if (!project) {
        throw new Error('Project not found')
      }

      return await prisma.project.update({
        where: { id },
        data: {
          likes: { increment: 1 }
        }
      })
    } catch (error) {
      console.error('Error toggling project like:', error)
      throw new Error('Failed to toggle project like')
    }
  }

  // 获取项目统计信息
  static async getProjectStats() {
    try {
      const [total, byCategory, byStatus, topProjects] = await Promise.all([
        prisma.project.count(),
        prisma.project.groupBy({
          by: ['category'],
          _count: { category: true }
        }),
        prisma.project.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.project.findMany({
          take: 5,
          orderBy: [
            { views: 'desc' },
            { likes: 'desc' }
          ],
          select: {
            id: true,
            title: true,
            views: true,
            likes: true,
            category: true
          }
        })
      ])

      const totalViews = await prisma.project.aggregate({
        _sum: { views: true }
      })

      const totalLikes = await prisma.project.aggregate({
        _sum: { likes: true }
      })

      return {
        total,
        totalViews: totalViews._sum.views || 0,
        totalLikes: totalLikes._sum.likes || 0,
        byCategory: byCategory.reduce((acc, item) => {
          acc[item.category] = item._count.category
          return acc
        }, {} as Record<string, number>),
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>),
        topProjects
      }
    } catch (error) {
      console.error('Error getting project stats:', error)
      throw new Error('Failed to get project statistics')
    }
  }
}