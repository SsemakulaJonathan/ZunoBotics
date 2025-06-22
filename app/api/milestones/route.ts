import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const milestones = await prisma.milestone.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { date: 'asc' }
      ]
    })

    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}