import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const launchTimelineItems = await prisma.launchTimelineItem.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({ launchTimelineItems })
  } catch (error) {
    console.error('Error fetching launch timeline items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}