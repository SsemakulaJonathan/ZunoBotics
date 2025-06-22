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

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    })

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Error fetching team member:', error)
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
    const { name, role, description, image, email, linkedin, github, order, isActive } = body

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    })

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    const teamMember = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(email !== undefined && { email }),
        ...(linkedin !== undefined && { linkedin }),
        ...(github !== undefined && { github }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Error updating team member:', error)
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

    const existingMember = await prisma.teamMember.findUnique({
      where: { id: params.id }
    })

    if (!existingMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }

    await prisma.teamMember.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}