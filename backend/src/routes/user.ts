import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { 
  getCurrentUser, 
  updateUserProfile, 
  getUserStats 
} from '../controllers/userController.js'

const router = express.Router()

// 获取当前用户信息
router.get('/me', authenticateToken, getCurrentUser)

// 更新用户资料
router.put('/profile', authenticateToken, updateUserProfile)

// 获取用户统计信息
router.get('/stats', authenticateToken, getUserStats)

export default router