import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { readFile } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function GET(
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

    // Get template info
    const template = await prisma.proposalTemplate.findUnique({
      where: { id: templateId }
    })

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Read file
    const filePath = path.join(process.cwd(), 'uploads', 'templates', template.filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // Determine content type
      const fileExtension = template.filename.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'
      
      if (fileExtension === 'pdf') {
        contentType = 'application/pdf'
      } else if (fileExtension === 'docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      } else if (fileExtension === 'doc') {
        contentType = 'application/msword'
      }

      // Increment download count
      await prisma.proposalTemplate.update({
        where: { id: templateId },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      })

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${template.name}.${fileExtension}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      })

    } catch (fileError) {
      console.error('File read error:', fileError)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Template download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}