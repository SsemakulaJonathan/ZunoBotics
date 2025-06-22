import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [
        { type: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ partners })
  } catch (error) {
    console.error('Error fetching partners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
