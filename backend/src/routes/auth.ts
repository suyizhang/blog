import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { UserService } from '../services/userService.js'

const router = express.Router()

// 扩展 Request 接口以包含用户信息
interface AuthRequest extends express.Request {
  user?: {
    userId: string
    login: string
  }
}

// GitHub OAuth 登录
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

// GitHub OAuth 回调
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req: express.Request, res: express.Response) => {
    try {
      const githubUser = req.user as any

      // 创建或更新用户
      const user = await UserService.createOrUpdateUser({
        githubId: githubUser.githubId,
        login: githubUser.username,
        name: githubUser.displayName,
        email: githubUser.email,
        avatarUrl: githubUser.avatarUrl
      })

      // 生成 JWT token
      const token = jwt.sign(
        { userId: user.id, login: user.login },
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '7d' }
      )

      // 重定向到前端并携带token
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`)
    } catch (error) {
      console.error('GitHub OAuth callback error:', error)
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`)
    }
  }
)

// 登出
router.post('/logout', (req: express.Request, res: express.Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' })
    }
    return res.json({ success: true, message: 'Logged out successfully' })
  })
})

// JWT 认证中间件
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'Access token required' })
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret', (err: any, user: any) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token' })
      return
    }
    (req as AuthRequest).user = user
    next()
  })
}

// 可选认证中间件（不强制要求认证）
function optionalAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    next()
    return
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret', (err: any, user: any) => {
    if (!err && user) {
      (req as AuthRequest).user = user
    }
    next()
  })
}

// 获取当前用户信息
router.get('/me', authenticateToken, (req: any, res: express.Response) => {
  return res.json({
    user: req.user,
    message: 'User authenticated successfully'
  })
})

export { router as authRoutes, authenticateToken, optionalAuth }
export type { AuthRequest }