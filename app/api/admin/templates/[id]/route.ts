import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

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

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { id: templateId } = await params
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const version = formData.get('version') as string
    const isActive = formData.get('isActive') === 'true'
    const file = formData.get('file') as File | null

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    let filename = null

    // Handle file upload if new file is provided
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

      // Get current template to delete old file
      const currentTemplate = await prisma.proposalTemplate.findUnique({
        where: { id: templateId }
      })

      if (currentTemplate) {
        // Delete old file
        try {
          const oldFilePath = path.join(process.cwd(), 'uploads', 'templates', currentTemplate.filename)
          await unlink(oldFilePath)
        } catch (error) {
          console.warn('Could not delete old template file:', error)
        }
      }

      // Create templates directory if it doesn't exist
      const templatesDir = path.join(process.cwd(), 'uploads', 'templates')
      try {
        await mkdir(templatesDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      filename = `template_${timestamp}.${fileExtension}`
      const filepath = path.join(templatesDir, filename)

      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filepath, buffer)
    }

    // Update template record
    const updateData: any = {
      name,
      description: description || null,
      version: version || '1.0',
      isActive
    }

    if (filename) {
      updateData.filename = filename
    }

    const updatedTemplate = await prisma.proposalTemplate.update({
      where: { id: templateId },
      data: updateData
    })

    return NextResponse.json({
      message: 'Template updated successfully',
      template: updatedTemplate
    })

  } catch (error) {
    console.error('Template update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: templateId } = await params

    // Get template to delete associated file
    const template = await prisma.proposalTemplate.findUnique({
      where: { id: templateId }
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Delete file
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'templates', template.filename)
      await unlink(filePath)
    } catch (error) {
      console.warn('Could not delete template file:', error)
    }

    // Delete template record
    await prisma.proposalTemplate.delete({
      where: { id: templateId }
    })

    return NextResponse.json({
      message: 'Template deleted successfully'
    })

  } catch (error) {
    console.error('Template deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}