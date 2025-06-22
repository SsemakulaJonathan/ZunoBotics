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

    const launchTimelineItems = await prisma.launchTimelineItem.findMany({
      orderBy: [
        { order: 'asc' },
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({ launchTimelineItems })
  } catch (error) {
    console.error('Error fetching launch timeline items:', error)
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
    const { title, description, year, date, order, isVisible, status } = body

    if (!title || !description || !year) {
      return NextResponse.json({ error: 'Title, description, and year are required' }, { status: 400 })
    }

    // Validate status
    const validStatuses = ['planned', 'in_progress', 'completed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const launchTimelineItem = await prisma.launchTimelineItem.create({
      data: {
        title,
        description,
        year,
        date: date ? new Date(date) : null,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
        status: status || 'planned'
      }
    })

    return NextResponse.json({ launchTimelineItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating launch timeline item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}