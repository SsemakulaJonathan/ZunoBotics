import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ['active', 'completed']
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
