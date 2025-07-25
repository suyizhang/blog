import { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ContactService } from '../services/contactService.js'

// 联系表单验证规则
export const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
]

// 处理联系表单提交
export const submitContactForm = async (req: Request, res: Response): Promise<Response> => {
  try {
    // 检查验证结果
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input and try again',
        details: errors.array()
      })
    }

    const { name, email, subject, message } = req.body

    // 获取用户信息（如果已登录）
    const userId = (req as any).user?.userId || null

    // 保存联系记录到数据库
    const contact = await ContactService.createContact({
      name,
      email,
      subject,
      message,
      userId: req.user?.id || req.user?.userId || undefined,
      ipAddress: req.ip || '',
      userAgent: req.get('User-Agent') || ''
    })

    console.log('Contact form submission saved:', {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      timestamp: contact.createdAt
    })

    // 这里可以添加邮件发送逻辑
    await simulateEmailSending({
      name,
      email,
      subject,
      message
    })

    return res.json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      timestamp: contact.createdAt,
      id: contact.id
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to send your message. Please try again later.'
    })
  }
}

// 模拟邮件发送
const simulateEmailSending = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  // 这里可以集成真实的邮件服务
  // 例如：SendGrid, Mailgun, 或者 nodemailer with SMTP

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Email notification sent for:', formData.subject)
      resolve(true)
    }, 1000)
  })
}

// 获取联系信息
export const getContactInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contactInfo = {
      email: 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      social: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername'
      },
      availability: {
        status: 'available', // available, busy, unavailable
        message: 'Currently available for new projects and opportunities'
      }
    }

    return res.json({
      success: true,
      contact: contactInfo
    })
  } catch (error) {
    console.error('Get contact info error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve contact information'
    })
  }
}

// 获取联系记录（管理员功能）
export const getContacts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status, limit = 20, offset = 0 } = req.query

    const result = await ContactService.getContacts({
      status: status as any,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    })

    return res.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve contacts'
    })
  }
}

// 更新联系记录状态
export const updateContactStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params
    const { status } = req.body

    const contact = await ContactService.updateContactStatus(id as string, status)

    return res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact
    })
  } catch (error) {
    console.error('Update contact status error:', error)
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update contact status'
    })
  }
}