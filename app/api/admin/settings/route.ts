import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all settings or a specific setting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key) {
      // Get specific setting
      const setting = await prisma.setting.findUnique({
        where: { key }
      });

      if (!setting) {
        return NextResponse.json(
          { success: false, error: 'Setting not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        setting: {
          key: setting.key,
          value: setting.type === 'number' ? parseFloat(setting.value) : setting.value,
          type: setting.type,
          label: setting.label,
          description: setting.description
        }
      });
    }

    // Get all settings
    const settings = await prisma.setting.findMany({
      where: { isVisible: true },
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.type === 'number' ? parseFloat(setting.value) : setting.value,
        type: setting.type,
        label: setting.label,
        description: setting.description,
        category: setting.category
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      settings: settingsMap
    });

  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// Create or update setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, type = 'string', label, description, category = 'general' } = body;

    if (!key || value === undefined || !label) {
      return NextResponse.json(
        { success: false, error: 'Key, value, and label are required' },
        { status: 400 }
      );
    }

    // Convert value to string for storage
    const stringValue = typeof value === 'string' ? value : String(value);

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type,
        label,
        description,
        category,
        updatedAt: new Date()
      },
      create: {
        key,
        value: stringValue,
        type,
        label,
        description,
        category
      }
    });

    return NextResponse.json({
      success: true,
      setting: {
        key: setting.key,
        value: setting.type === 'number' ? parseFloat(setting.value) : setting.value,
        type: setting.type,
        label: setting.label,
        description: setting.description
      }
    });

  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save setting' },
      { status: 500 }
    );
  }
}