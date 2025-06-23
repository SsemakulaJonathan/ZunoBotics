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

    const metrics = await prisma.impactMetric.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching impact metrics:', error)
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
    const { icon, count, label, description, order, isVisible } = body

    if (!icon || !count || !label || !description) {
      return NextResponse.json({ error: 'Icon, count, label, and description are required' }, { status: 400 })
    }

    const metric = await prisma.impactMetric.create({
      data: {
        icon,
        count,
        label,
        description,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true
      }
    })

    return NextResponse.json({ metric }, { status: 201 })
  } catch (error) {
    console.error('Error creating impact metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}