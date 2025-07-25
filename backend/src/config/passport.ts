import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import jwt from 'jsonwebtoken'
import { UserService } from '../services/userService.js'

export const configurePassport = () => {
  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5001/api/auth/github/callback'
  },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // 使用数据库服务查找或创建用户
        const user = await UserService.findOrCreateByGithubId(profile)

        console.log('GitHub OAuth user processed:', {
          id: user.id,
          login: user.login,
          name: user.name
        })

        return done(null, user)
      } catch (error) {
        console.error('GitHub OAuth error:', error)
        return done(error, null)
      }
    }))

  // 序列化用户信息到session
  passport.serializeUser((user: any, done) => {
    // 只存储用户ID到session
    done(null, user.id)
  })

  // 从session反序列化用户信息
  passport.deserializeUser(async (id: string, done) => {
    try {
      // 从数据库获取完整用户信息
      const user = await UserService.findById(id)
      if (user) {
        done(null, user)
      } else {
        done(new Error('User not found'), null)
      }
    } catch (error) {
      console.error('Deserialize user error:', error)
      done(error, null)
    }
  })
}