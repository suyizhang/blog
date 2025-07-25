import { PrismaClient } from '@prisma/client'
import type { User } from '@prisma/client'

const prisma = new PrismaClient()

export class UserService {
  // 根据GitHub ID获取或创建用户
  static async findOrCreateByGithubId(githubProfile: any): Promise<User> {
    try {
      const githubId = githubProfile.id.toString()

      // 先尝试查找现有用户
      let user = await prisma.user.findUnique({
        where: { githubId }
      })

      if (!user) {
        // 创建新用户
        user = await prisma.user.create({
          data: {
            githubId,
            login: githubProfile.username,
            name: githubProfile.displayName || githubProfile.username,
            email: githubProfile.emails?.[0]?.value || null,
            avatarUrl: githubProfile._json?.avatar_url || null,
            bio: githubProfile._json?.bio || null,
            location: githubProfile._json?.location || null,
            website: githubProfile._json?.blog || null,
            company: githubProfile._json?.company || null,
            followers: githubProfile._json?.followers || 0,
            following: githubProfile._json?.following || 0,
            publicRepos: githubProfile._json?.public_repos || 0,
            lastLoginAt: new Date()
          }
        })
      } else {
        // 更新现有用户的登录时间和可能变化的信息
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: githubProfile.displayName || githubProfile.username,
            email: githubProfile.emails?.[0]?.value || user.email,
            avatarUrl: githubProfile._json?.avatar_url || user.avatarUrl,
            bio: githubProfile._json?.bio || user.bio,
            location: githubProfile._json?.location || user.location,
            website: githubProfile._json?.blog || user.website,
            company: githubProfile._json?.company || user.company,
            followers: githubProfile._json?.followers || user.followers,
            following: githubProfile._json?.following || user.following,
            publicRepos: githubProfile._json?.public_repos || user.publicRepos,
            lastLoginAt: new Date()
          }
        })
      }

      return user
    } catch (error) {
      console.error('Error in findOrCreateByGithubId:', error)
      throw new Error('Failed to find or create user')
    }
  }

  // Alias for compatibility with auth routes
  static async createOrUpdateUser(githubData: {
    githubId: string
    login: string
    name?: string
    email?: string
    avatarUrl?: string
  }): Promise<User> {
    // Convert the data format to match findOrCreateByGithubId
    const githubProfile = {
      id: githubData.githubId,
      username: githubData.login,
      displayName: githubData.name,
      emails: githubData.email ? [{ value: githubData.email }] : [],
      _json: {
        avatar_url: githubData.avatarUrl
      }
    }

    return this.findOrCreateByGithubId(githubProfile)
  }

  // 通过 ID 获取用户
  static async findById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          projects: {
            where: { featured: true },
            take: 3,
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: {
              projects: true,
              blogPosts: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  // 更新用户资料
  static async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  // 获取用户统计信息
  static async getUserStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              projects: true,
              blogPosts: { where: { published: true } },
              contacts: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // 计算项目总浏览量和点赞数
      const projectStats = await prisma.project.aggregate({
        where: { userId },
        _sum: {
          views: true,
          likes: true
        }
      })

      // 计算博客总浏览量和点赞数
      const blogStats = await prisma.blogPost.aggregate({
        where: { userId, published: true },
        _sum: {
          views: true,
          likes: true
        }
      })

      return {
        totalProjects: user._count.projects,
        totalBlogPosts: user._count.blogPosts,
        totalContacts: user._count.contacts,
        totalProjectViews: projectStats._sum.views || 0,
        totalProjectLikes: projectStats._sum.likes || 0,
        totalBlogViews: blogStats._sum.views || 0,
        totalBlogLikes: blogStats._sum.likes || 0,
        joinedDate: user.createdAt,
        lastActive: user.lastLoginAt,
        githubStats: {
          followers: user.followers,
          following: user.following,
          publicRepos: user.publicRepos
        }
      }
    } catch (error) {
      console.error('Error getting user stats:', error)
      throw new Error('Failed to get user statistics')
    }
  }
}