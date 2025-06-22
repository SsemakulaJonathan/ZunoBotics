import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      orderBy: [
        { isPopular: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ tools })
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}