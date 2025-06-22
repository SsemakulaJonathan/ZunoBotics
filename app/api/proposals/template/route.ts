import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get active template
    const template = await prisma.proposalTemplate.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    if (!template) {
      return NextResponse.json({ error: 'No template available' }, { status: 404 })
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
        where: { id: template.id },
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
      return NextResponse.json({ error: 'Template file not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Template download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}