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

    const tool = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    return NextResponse.json({ tool })
  } catch (error) {
    console.error('Error fetching tool:', error)
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
    const { name, description, useCase, category, icon, website, isPopular, order } = body

    const existingTool = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!existingTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['programming', 'hardware', 'software', 'platform']
      if (!validCategories.includes(category)) {
        return NextResponse.json({ error: 'Invalid tool category' }, { status: 400 })
      }
    }

    const tool = await prisma.tool.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(useCase !== undefined && { useCase }),
        ...(category !== undefined && { category }),
        ...(icon !== undefined && { icon }),
        ...(website !== undefined && { website }),
        ...(isPopular !== undefined && { isPopular }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json({ tool })
  } catch (error) {
    console.error('Error updating tool:', error)
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

    const existingTool = await prisma.tool.findUnique({
      where: { id: params.id }
    })

    if (!existingTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    await prisma.tool.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Tool deleted successfully' })
  } catch (error) {
    console.error('Error deleting tool:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}