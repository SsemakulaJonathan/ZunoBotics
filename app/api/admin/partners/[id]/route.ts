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

    const partner = await prisma.partner.findUnique({
      where: { id: params.id }
    })

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json({ partner })
  } catch (error) {
    console.error('Error fetching partner:', error)
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
    const { name, logo, website, description, type, location } = body

    const existingPartner = await prisma.partner.findUnique({
      where: { id: params.id }
    })

    if (!existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['university', 'corporate', 'ngo']
      if (!validTypes.includes(type)) {
        return NextResponse.json({ error: 'Invalid partner type' }, { status: 400 })
      }
    }

    const partner = await prisma.partner.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(logo !== undefined && { logo }),
        ...(website !== undefined && { website }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(location !== undefined && { location })
      }
    })

    return NextResponse.json({ partner })
  } catch (error) {
    console.error('Error updating partner:', error)
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

    const existingPartner = await prisma.partner.findUnique({
      where: { id: params.id }
    })

    if (!existingPartner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    await prisma.partner.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Partner deleted successfully' })
  } catch (error) {
    console.error('Error deleting partner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}