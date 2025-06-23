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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: metricId } = await params
    const body = await request.json()
    const { icon, count, label, description, order, isVisible } = body

    const existingMetric = await prisma.impactMetric.findUnique({
      where: { id: metricId }
    })

    if (!existingMetric) {
      return NextResponse.json({ error: 'Impact metric not found' }, { status: 404 })
    }

    const metric = await prisma.impactMetric.update({
      where: { id: metricId },
      data: {
        ...(icon !== undefined && { icon }),
        ...(count !== undefined && { count }),
        ...(label !== undefined && { label }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible })
      }
    })

    return NextResponse.json({ metric })
  } catch (error) {
    console.error('Error updating impact metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: metricId } = await params

    const existingMetric = await prisma.impactMetric.findUnique({
      where: { id: metricId }
    })

    if (!existingMetric) {
      return NextResponse.json({ error: 'Impact metric not found' }, { status: 404 })
    }

    await prisma.impactMetric.delete({
      where: { id: metricId }
    })

    return NextResponse.json({ message: 'Impact metric deleted successfully' })
  } catch (error) {
    console.error('Error deleting impact metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}