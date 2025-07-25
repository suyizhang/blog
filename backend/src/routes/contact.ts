import express from 'express'
import { 
  submitContactForm, 
  getContactInfo, 
  contactValidation 
} from '../controllers/contactController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// 提交联系表单
router.post('/submit', contactValidation, submitContactForm)

// 获取联系信息
router.get('/info', optionalAuth, getContactInfo)

export default router