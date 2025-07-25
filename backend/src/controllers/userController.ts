import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/userService.js'

// 扩展 Request 接口以包含用户信息
interface AuthRequest extends Request {
  user?: {
    userId: string
    login: string
  }
}

// 获取当前用户信息
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      })
    }

    // 从数据库获取详细的用户信息
    const user = await UserService.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found in database'
      })
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatarUrl: user.avatarUrl,
        company: user.company,
        title: user.title,
        skills: user.skills ? JSON.parse(user.skills) : [],
        experience: user.experience,
        education: user.education,
        followers: user.followers,
        following: user.following,
        publicRepos: user.publicRepos,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user information'
    })
  }
}

// 更新用户资料
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      })
    }

    const { name, bio, location, website, title, skills, experience, education } = req.body

    // 验证和处理技能数组
    let skillsJson = null
    if (skills && Array.isArray(skills)) {
      skillsJson = JSON.stringify(skills)
    }

    const updatedUser = await UserService.updateProfile(req.user.userId, {
      name: name || undefined,
      bio: bio || undefined,
      location: location || undefined,
      website: website || undefined,
      title: title || undefined,
      skills: skillsJson,
      experience: experience || undefined,
      education: education || undefined
    })

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        login: updatedUser.login,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        avatarUrl: updatedUser.avatarUrl,
        company: updatedUser.company,
        title: updatedUser.title,
        skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : [],
        experience: updatedUser.experience,
        education: updatedUser.education,
        updatedAt: updatedUser.updatedAt
      }
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user profile'
    })
  }
}

// 获取用户统计信息
export const getUserStats = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated'
      })
    }

    const stats = await UserService.getUserStats(req.user.userId)

    return res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Get user stats error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user statistics'
    })
  }
}