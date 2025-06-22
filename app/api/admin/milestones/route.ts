import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string }
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId, isActive: true }
    })
    return admin
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const milestones = await prisma.milestone.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, year, date, type, order, isVisible } = body

    if (!title || !description || !year) {
      return NextResponse.json({ error: 'Title, description, and year are required' }, { status: 400 })
    }

    // Validate type
    const validTypes = ['milestone', 'achievement', 'event']
    if (type && !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid milestone type' }, { status: 400 })
    }

    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        year,
        date: date ? new Date(date) : null,
        type: type || 'milestone',
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true
      }
    })

    return NextResponse.json({ milestone }, { status: 201 })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}