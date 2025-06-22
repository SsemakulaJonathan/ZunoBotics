import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const university = formData.get('university') as string
    const projectTitle = formData.get('projectTitle') as string
    const description = formData.get('description') as string
    const file = formData.get('proposal') as File

    // Validate required fields
    if (!name || !email || !university || !projectTitle || !description || !file) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

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
    const filename = `${timestamp}_${name.replace(/\s+/g, '_')}.${fileExtension}`
    const filepath = path.join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Here you would typically save the proposal data to your database
    // For now, we'll log it (in production, save to database)
    const proposalData = {
      id: timestamp,
      name,
      email,
      university,
      projectTitle,
      description,
      filename,
      submittedAt: new Date().toISOString()
    }

    console.log('New proposal submitted:', proposalData)

    // TODO: Add database storage here
    // await db.proposal.create({ data: proposalData })

    // TODO: Send email notification to admins
    // await sendNotificationEmail(proposalData)

    return NextResponse.json(
      { 
        message: 'Proposal submitted successfully',
        proposalId: timestamp
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