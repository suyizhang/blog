import { prisma } from '../lib/prisma.js'
import { Contact, ContactStatus, Prisma } from '@prisma/client'

export class ContactService {
  // 创建联系表单记录
  static async createContact(data: {
    name: string
    email: string
    subject: string
    message: string
    userId?: string
    ipAddress?: string
    userAgent?: string
  }): Promise<Contact> {
    try {
      return await prisma.contact.create({
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          userId: data.userId || null,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
          status: ContactStatus.UNREAD
        },
        include: {
          user: {
            select: {
              id: true,
              login: true,
              name: true
            }
          }
        }
      })
    } catch (error) {
      console.error('Error creating contact:', error)
      throw new Error('Failed to create contact record')
    }
  }

  // 获取所有联系记录（管理员功能）
  static async getContacts(filters: {
    status?: ContactStatus
    limit?: number
    offset?: number
  } = {}) {
    try {
      const where: Prisma.ContactWhereInput = {}

      if (filters.status) {
        where.status = filters.status
      }

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
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
          orderBy: { createdAt: 'desc' },
          ...(filters.limit && { take: filters.limit }),
          ...(filters.offset && { skip: filters.offset })
        }),
        prisma.contact.count({ where })
      ])

      return {
        contacts,
        total,
        hasMore: filters.limit ? (filters.offset || 0) + filters.limit < total : false
      }
    } catch (error) {
      console.error('Error getting contacts:', error)
      throw new Error('Failed to get contacts')
    }
  }

  // 获取单个联系记录
  static async getContactById(id: string): Promise<Contact | null> {
    try {
      return await prisma.contact.findUnique({
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
    } catch (error) {
      console.error('Error getting contact by ID:', error)
      return null
    }
  }

  // 更新联系记录状态
  static async updateContactStatus(id: string, status: ContactStatus): Promise<Contact> {
    try {
      return await prisma.contact.update({
        where: { id },
        data: {
          status,
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
      console.error('Error updating contact status:', error)
      throw new Error('Failed to update contact status')
    }
  }

  // 删除联系记录
  static async deleteContact(id: string): Promise<boolean> {
    try {
      const result = await prisma.contact.delete({
        where: { id }
      })
      return !!result
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw new Error('Failed to delete contact')
    }
  }

  // 获取联系统计信息
  static async getContactStats() {
    try {
      const [total, byStatus, recent] = await Promise.all([
        prisma.contact.count(),
        prisma.contact.groupBy({
          by: ['status'],
          _count: { status: true }
        }),
        prisma.contact.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            subject: true,
            status: true,
            createdAt: true
          }
        })
      ])

      return {
        total,
        byStatus: byStatus.reduce((acc, item) => {
          acc[item.status] = item._count.status
          return acc
        }, {} as Record<string, number>),
        recent
      }
    } catch (error) {
      console.error('Error getting contact stats:', error)
      throw new Error('Failed to get contact statistics')
    }
  }
}