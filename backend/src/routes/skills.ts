import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/skills - 获取所有技能
router.get('/', async (req, res) => {
  try {
    const { category } = req.query

    const whereClause = category ? { category: category as string } : {}

    const skills = await prisma.skill.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    res.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skills'
    })
  }
})

// GET /api/skills/categories - 获取技能分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.skill.findMany({
      select: { category: true },
      distinct: ['category']
    })

    const categoryList = categories.map((item: { category: string }) => item.category)

    res.json({
      success: true,
      categories: categoryList
    })
  } catch (error) {
    console.error('Error fetching skill categories:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skill categories'
    })
  }
})

export default router