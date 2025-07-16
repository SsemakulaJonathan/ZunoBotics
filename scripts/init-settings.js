const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeSettings() {
  try {
    // Initialize fundraising goal
    await prisma.setting.upsert({
      where: { key: 'fundraising_goal' },
      update: {},
      create: {
        key: 'fundraising_goal',
        value: '100000',
        type: 'number',
        label: 'Fundraising Goal',
        description: 'Target amount for the fundraising campaign (in USD)',
        category: 'fundraising'
      }
    });

    // Initialize other default settings
    await prisma.setting.upsert({
      where: { key: 'site_name' },
      update: {},
      create: {
        key: 'site_name',
        value: 'ZunoBotics',
        type: 'string',
        label: 'Site Name',
        description: 'Name of the organization/site',
        category: 'general'
      }
    });

    await prisma.setting.upsert({
      where: { key: 'contact_email' },
      update: {},
      create: {
        key: 'contact_email',
        value: 'info@zunobotics.com',
        type: 'string',
        label: 'Contact Email',
        description: 'Primary contact email address',
        category: 'general'
      }
    });

    console.log('✅ Settings initialized successfully!');
    
    // Show current settings
    const settings = await prisma.setting.findMany();
    console.log('\n📋 Current settings:');
    settings.forEach(setting => {
      console.log(`${setting.key}: ${setting.value} (${setting.type})`);
    });

  } catch (error) {
    console.error('❌ Error initializing settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeSettings();