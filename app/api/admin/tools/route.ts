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

    const tools = await prisma.tool.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Error fetching tools:', error)
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
    const { name, description, useCase, category, icon, website, isPopular, order } = body

    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Name, description, and category are required' }, { status: 400 })
    }

    // Validate category
    const validCategories = ['programming', 'hardware', 'software', 'platform']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid tool category' }, { status: 400 })
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        useCase: useCase || null,
        category,
        icon: icon || null,
        website: website || null,
        isPopular: isPopular || false,
        order: order || 0
      }
    })

    return NextResponse.json({ tool }, { status: 201 })
  } catch (error) {
    console.error('Error creating tool:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}