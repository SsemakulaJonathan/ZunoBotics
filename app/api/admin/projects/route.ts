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

    // Fetch all projects
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ projects })

  } catch (error) {
    console.error('Projects API error:', error)
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

    const projectData = await request.json()

    // Validate required fields
    if (!projectData.title || !projectData.description || !projectData.university) {
      return NextResponse.json(
        { error: 'Title, description, and university are required' },
        { status: 400 }
      )
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        title: projectData.title,
        description: projectData.description,
        impact: projectData.impact || null,
        image: projectData.image || null,
        tags: projectData.tags || [],
        university: projectData.university,
        contributors: projectData.contributors || 1,
        repoStars: projectData.repoStars || 0,
        githubUrl: projectData.githubUrl || null,
        demoUrl: projectData.demoUrl || null,
        dateCompleted: projectData.dateCompleted || null,
        category: projectData.category || null,
        technology: projectData.technology || [],
        status: projectData.status || 'active'
      }
    })

    return NextResponse.json({
      message: 'Project created successfully',
      project
    })

  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}