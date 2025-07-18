import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
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

    // Fetch all universities
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ universities })

  } catch (error) {
    console.error('Universities API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'University name is required' },
        { status: 400 }
      )
    }

    // Check if university already exists
    const existingUniversity = await prisma.university.findUnique({
      where: { name: name.trim() }
    })

    if (existingUniversity) {
      return NextResponse.json(
        { error: 'University already exists' },
        { status: 409 }
      )
    }

    // Create new university
    const university = await prisma.university.create({
      data: {
        name: name.trim(),
        location: location?.trim() || null,
        isActive: true
      }
    })

    return NextResponse.json({
      message: 'University created successfully',
      university
    })

  } catch (error) {
    console.error('University creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}