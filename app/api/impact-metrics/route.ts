import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const metrics = await prisma.impactMetric.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching impact metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}