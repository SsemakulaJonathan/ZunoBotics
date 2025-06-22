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

    let adminData
    try {
      adminData = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { status, reviewNotes } = await request.json()
    const proposalId = params.id

    // Validate status
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update proposal
    const updatedProposal = await prisma.proposalSubmission.update({
      where: { id: proposalId },
      data: {
        status,
        reviewNotes,
        reviewedBy: adminData.email,
        reviewedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Proposal updated successfully',
      proposal: updatedProposal
    })

  } catch (error) {
    console.error('Proposal update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}