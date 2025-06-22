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

    const milestone = await prisma.milestone.findUnique({
      where: { id: params.id }
    })

    if (!milestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    return NextResponse.json({ milestone })
  } catch (error) {
    console.error('Error fetching milestone:', error)
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
    const { title, description, year, date, type, order, isVisible } = body

    const existingMilestone = await prisma.milestone.findUnique({
      where: { id: params.id }
    })

    if (!existingMilestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['milestone', 'achievement', 'event']
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid milestone type' }, { status: 400 })
      }
    }

    const milestone = await prisma.milestone.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(year !== undefined && { year }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(type !== undefined && { type }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible })
      }
    })

    return NextResponse.json({ milestone })
  } catch (error) {
    console.error('Error updating milestone:', error)
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

    const existingMilestone = await prisma.milestone.findUnique({
      where: { id: params.id }
    })

    if (!existingMilestone) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    await prisma.milestone.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Milestone deleted successfully' })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}