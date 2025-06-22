import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { PrismaClient } from '@prisma/client'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const university = formData.get('university') as string
    const projectTitle = formData.get('projectTitle') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File

    // Validate required fields - file is optional
    if (!name || !email || !university || !projectTitle || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    let filename = null

    // Handle file upload if file is provided
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Only PDF and DOCX files are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size must be less than 10MB' },
          { status: 400 }
        )
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'proposals')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      filename = `${timestamp}_${name.replace(/\s+/g, '_')}.${fileExtension}`
      const filepath = path.join(uploadsDir, filename)

      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
    }

    // Save proposal data to database
    const proposal = await prisma.proposalSubmission.create({
      data: {
        name,
        email,
        university,
        projectTitle,
        description,
        filename,
        status: 'pending'
      }
    })

    console.log('New proposal submitted:', proposal)

    // TODO: Send email notification to admins
    // await sendNotificationEmail(proposal)

    return NextResponse.json(
      { 
        message: 'Proposal submitted successfully',
        proposalId: proposal.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing proposal submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}