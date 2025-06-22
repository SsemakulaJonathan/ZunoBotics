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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, year, date, order, isVisible, status } = body

    // Validate status if provided
    if (status) {
      const validStatuses = ['planned', 'in_progress', 'completed']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
    }

    const updatedItem = await prisma.launchTimelineItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(year && { year }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible }),
        ...(status && { status })
      }
    })

    return NextResponse.json({ launchTimelineItem: updatedItem })
  } catch (error) {
    console.error('Error updating launch timeline item:', error)
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

    const { id } = await params

    await prisma.launchTimelineItem.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Launch timeline item deleted successfully' })
  } catch (error) {
    console.error('Error deleting launch timeline item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}