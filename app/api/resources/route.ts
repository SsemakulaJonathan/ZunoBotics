import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}