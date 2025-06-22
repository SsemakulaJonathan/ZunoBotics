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

    const resources = await prisma.resource.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
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
    const { title, description, type, url, category, difficulty, isExternal, isFeatured, order } = body

    if (!title || !description || !type || !category || !difficulty) {
      return NextResponse.json({ error: 'Title, description, type, category, and difficulty are required' }, { status: 400 })
    }

    // Validate type
    const validTypes = ['tutorial', 'documentation', 'video', 'course', 'book']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 })
    }

    // Validate difficulty
    const validDifficulties = ['beginner', 'intermediate', 'advanced']
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 })
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        url: url || null,
        category,
        difficulty,
        isExternal: isExternal !== undefined ? isExternal : true,
        isFeatured: isFeatured || false,
        order: order || 0
      }
    })

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}