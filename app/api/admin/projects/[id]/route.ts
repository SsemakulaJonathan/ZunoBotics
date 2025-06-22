import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { id: projectId } = await params

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
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
      message: 'Project updated successfully',
      project: updatedProject
    })

  } catch (error) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: projectId } = await params

    // Delete project
    await prisma.project.delete({
      where: { id: projectId }
    })

    return NextResponse.json({
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Project deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}