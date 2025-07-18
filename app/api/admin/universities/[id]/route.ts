import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { name, location } = await request.json()
    const { id } = params

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'University name is required' },
        { status: 400 }
      )
    }

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    // Check if name already exists (excluding current university)
    const duplicateUniversity = await prisma.university.findFirst({
      where: { 
        name: name.trim(),
        id: { not: id }
      }
    })

    if (duplicateUniversity) {
      return NextResponse.json(
        { error: 'University name already exists' },
        { status: 409 }
      )
    }

    // Update university
    const updatedUniversity = await prisma.university.update({
      where: { id },
      data: {
        name: name.trim(),
        location: location?.trim() || null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'University updated successfully',
      university: updatedUniversity
    })

  } catch (error) {
    console.error('University update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id } = params

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    // Soft delete - set isActive to false
    const deletedUniversity = await prisma.university.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'University deleted successfully',
      university: deletedUniversity
    })

  } catch (error) {
    console.error('University deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}