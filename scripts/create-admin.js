const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@zunobotics.com',
        name: 'ZunoBotics Admin',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ Admin user already exists!')
    } else {
      console.error('❌ Error creating admin:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()