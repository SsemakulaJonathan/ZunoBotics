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

    // Fetch dashboard statistics
    const [
      proposalStats,
      projectStats,
      partnerCount,
      teamMemberCount
    ] = await Promise.all([
      prisma.proposalSubmission.groupBy({
        by: ['status'],
        _count: { _all: true }
      }),
      prisma.project.groupBy({
        by: ['status'],
        _count: { _all: true }
      }),
      prisma.partner.count(),
      prisma.teamMember.count({ where: { isActive: true } })
    ])

    // Process proposal stats
    const proposals = {
      total: proposalStats.reduce((sum, stat) => sum + stat._count._all, 0),
      pending: proposalStats.find(s => s.status === 'pending')?._count._all || 0,
      approved: proposalStats.find(s => s.status === 'approved')?._count._all || 0
    }

    // Process project stats
    const projects = {
      total: projectStats.reduce((sum, stat) => sum + stat._count._all, 0),
      active: projectStats.find(s => s.status === 'active')?._count._all || 0
    }

    return NextResponse.json({
      proposals,
      projects,
      partners: { total: partnerCount },
      teamMembers: { total: teamMemberCount }
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}