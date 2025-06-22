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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resource = await prisma.resource.findUnique({
      where: { id: params.id }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    return NextResponse.json({ resource })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, url, category, difficulty, isExternal, isFeatured, order } = body

    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id }
    })

    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['tutorial', 'documentation', 'video', 'course', 'book']
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 })
      }
    }

    // Validate difficulty if provided
    if (difficulty) {
      const validDifficulties = ['beginner', 'intermediate', 'advanced']
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 })
      }
    }

    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(url !== undefined && { url }),
        ...(category !== undefined && { category }),
        ...(difficulty !== undefined && { difficulty }),
        ...(isExternal !== undefined && { isExternal }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json({ resource })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingResource = await prisma.resource.findUnique({
      where: { id: params.id }
    })

    if (!existingResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    await prisma.resource.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}