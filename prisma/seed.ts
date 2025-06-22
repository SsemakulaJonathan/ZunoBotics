import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed Team Members
  console.log('Seeding team members...')
  const teamMembers = [
    {
      name: 'Jonathan Ssemakula',
      role: 'Founder & Lead Engineer',
      description: 'Passionate about empowering African innovators through technology and robotics.',
      image: '/images/team/jon.jpg',
      order: 1,
    },
    {
      name: 'Isaac Ssozi',
      role: 'Technical Director',
      description: 'Expert in robotics and automation with focus on open-source development.',
      image: '/images/team/isaac.png',
      order: 2,
    },
    {
      name: 'Farouk Jjingo',
      role: 'Community Manager',
      description: 'Building connections between students, mentors, and the broader tech community.',
      image: '/images/team/farouk.png',
      order: 3,
    },
  ]

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name }
    })
    
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: member,
      })
    } else {
      await prisma.teamMember.create({
        data: member,
      })
    }
  }

  // Seed Partners
  console.log('Seeding partners...')
  const partners = [
    {
      name: 'Makerere University',
      logo: '/images/partners/makerere.jpeg',
      type: 'university',
      location: 'Kampala, Uganda',
      description: 'Premier university in Uganda, leading in engineering and technology.',
    },
    {
      name: 'Kyambogo University',
      logo: '/images/partners/kyambogo.jpeg',
      type: 'university',
      location: 'Kampala, Uganda',
      description: 'Technical university with strong engineering programs.',
    },
    {
      name: 'Uganda Martyrs University',
      logo: '/images/partners/uganda-martyrs.jpeg',
      type: 'university',
      location: 'Nkozi, Uganda',
      description: 'Private university with innovative technology programs.',
    },
    {
      name: 'Mbarara University',
      logo: '/images/partners/mbarara.jpeg',
      type: 'university',
      location: 'Mbarara, Uganda',
      description: 'Science and technology focused university.',
    },
    {
      name: 'Innovation Hub',
      logo: '/images/partners/innovation-hub.jpg',
      type: 'corporate',
      location: 'Kampala, Uganda',
      description: 'Technology incubator supporting African startups.',
    },
    {
      name: 'TechBit',
      logo: '/images/partners/techbit.jpeg',
      type: 'corporate',
      location: 'Kampala, Uganda',
      description: 'Technology solutions provider and innovation partner.',
    },
  ]

  for (const partner of partners) {
    const existing = await prisma.partner.findFirst({
      where: { name: partner.name }
    })
    
    if (existing) {
      await prisma.partner.update({
        where: { id: existing.id },
        data: partner,
      })
    } else {
      await prisma.partner.create({
        data: partner,
      })
    }
  }

  // Seed Student Projects
  console.log('Seeding student projects...')
  const projects = [
    {
      title: 'Smart Irrigation System',
      description: 'Automated irrigation system using IoT sensors for optimal water management in agriculture.',
      impact: '30% increase in crop yields with 40% less water usage',
      image: '/Irrigation_Robot.png',
      tags: ['IoT', 'Agriculture', 'Sensors'],
      university: 'Makerere University',
      contributors: 3,
      repoStars: 45,
      githubUrl: 'https://github.com/zunobotics/smart-irrigation',
      category: 'Agriculture',
      technology: ['Arduino', 'Python', 'IoT'],
      dateCompleted: 'March 2024',
      status: 'completed',
    },
    {
      title: 'Medical Drone System',
      description: 'Autonomous drone for medical supply delivery to remote areas in Uganda.',
      impact: 'Reduced delivery time from 3 hours to 20 minutes in pilot area',
      image: '/Medical_Drone.png',
      tags: ['Drones', 'Healthcare', 'Autonomous'],
      university: 'Kyambogo University',
      contributors: 4,
      repoStars: 67,
      githubUrl: 'https://github.com/zunobotics/medical-drone',
      category: 'Healthcare',
      technology: ['Raspberry Pi', 'Computer Vision', 'GPS'],
      dateCompleted: 'February 2024',
      status: 'completed',
    },
    {
      title: 'Poultry Monitoring System',
      description: 'Smart system for monitoring poultry health and environmental conditions.',
      impact: '15% reduction in chick mortality rates in test deployment',
      image: '/Poultry_Monitor.png',
      tags: ['Agriculture', 'Monitoring', 'Health'],
      university: 'Uganda Martyrs University',
      contributors: 2,
      repoStars: 23,
      githubUrl: 'https://github.com/zunobotics/poultry-monitor',
      category: 'Agriculture',
      technology: ['ESP32', 'Sensors', 'Mobile App'],
      dateCompleted: 'January 2024',
      status: 'completed',
    },
    {
      title: 'Assistive Robot for Visually Impaired',
      description: 'Navigation assistance robot for people with visual impairments.',
      impact: 'Increased independence for users in pilot testing',
      image: '/Visually_Impaired.png',
      tags: ['Accessibility', 'Navigation', 'AI'],
      university: 'Mbarara University',
      contributors: 5,
      repoStars: 89,
      githubUrl: 'https://github.com/zunobotics/assistive-robot',
      category: 'Accessibility',
      technology: ['Computer Vision', 'Voice Recognition', 'Machine Learning'],
      dateCompleted: 'April 2024',
      status: 'completed',
    },
    {
      title: 'Waste Sorting Robot',
      description: 'Automated waste sorting system using computer vision and machine learning.',
      impact: '90% accuracy in sorting plastic, metal and paper waste',
      image: '/Waste_Sorting.png',
      tags: ['Environment', 'AI', 'Automation'],
      university: 'Makerere University',
      contributors: 3,
      repoStars: 34,
      githubUrl: 'https://github.com/zunobotics/waste-sorting',
      category: 'Environment',
      technology: ['TensorFlow', 'Computer Vision', 'Robotics'],
      dateCompleted: 'December 2023',
      status: 'completed',
    },
    {
      title: 'Water Quality Monitor',
      description: 'Real-time water quality monitoring system for rural communities.',
      impact: 'Early detection of pollutants in Lake Victoria tributaries',
      image: '/Water_Monitor.png',
      tags: ['Environment', 'Sensors', 'Community'],
      university: 'Kyambogo University',
      contributors: 2,
      repoStars: 56,
      githubUrl: 'https://github.com/zunobotics/water-monitor',
      category: 'Environment',
      technology: ['Arduino', 'Water Sensors', 'Data Analytics'],
      dateCompleted: 'November 2023',
      status: 'completed',
    },
  ]

  for (const project of projects) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title }
    })
    
    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: project,
      })
    } else {
      await prisma.project.create({
        data: project,
      })
    }
  }

  // Seed Milestones
  console.log('Seeding milestones...')
  const milestones = [
    {
      title: 'ZunoBotics Founded',
      description: 'Established with the vision to empower African innovation through robotics.',
      year: '2023',
      date: new Date('2023-01-15'),
      type: 'milestone',
      order: 1,
    },
    {
      title: 'First University Partnership',
      description: 'Partnered with Makerere University to launch our first pilot program.',
      year: '2023',
      date: new Date('2023-03-20'),
      type: 'achievement',
      order: 2,
    },
    {
      title: 'Open Source Initiative Launch',
      description: 'Launched our open-source platform for sharing robotics projects.',
      year: '2023',
      date: new Date('2023-06-10'),
      type: 'milestone',
      order: 3,
    },
    {
      title: '50 Students Supported',
      description: 'Reached milestone of supporting 50+ students across multiple universities.',
      year: '2024',
      date: new Date('2024-01-01'),
      type: 'achievement',
      order: 4,
    },
    {
      title: 'Pilot at Makerere and Kyambogo Universities',
      description: 'Establish initial presence, set up small labs, recruit mentors, and begin outreach.',
      year: '2025',
      date: new Date('2025-03-01'),
      type: 'milestone',
      order: 5,
    },
    {
      title: 'Evaluation and Adjustment',
      description: 'Assess pilot success, gather feedback, and refine processes based on lessons learned.',
      year: 'Late 2025',
      date: new Date('2025-10-01'),
      type: 'milestone',
      order: 6,
    },
    {
      title: 'Expansion to More Ugandan Universities',
      description: 'Expand to other Ugandan universities and technical institutes.',
      year: '2026',
      date: new Date('2026-06-01'),
      type: 'milestone',
      order: 7,
    },
    {
      title: 'Regional Outreach to Rwanda and East Africa',
      description: 'Extend to neighboring countries, starting with Rwanda.',
      year: '2027',
      date: new Date('2027-01-01'),
      type: 'milestone',
      order: 8,
    },
  ]

  for (const milestone of milestones) {
    const existing = await prisma.milestone.findFirst({
      where: { title: milestone.title }
    })
    
    if (existing) {
      await prisma.milestone.update({
        where: { id: existing.id },
        data: milestone,
      })
    } else {
      await prisma.milestone.create({
        data: milestone,
      })
    }
  }

  // Seed Tools and Technologies
  console.log('Seeding tools and technologies...')
  const tools = [
    {
      name: 'Arduino',
      description: 'Open-source electronics platform for prototyping',
      category: 'hardware',
      website: 'https://arduino.cc',
      isPopular: true,
      order: 1,
    },
    {
      name: 'Raspberry Pi',
      description: 'Single-board computer for IoT and robotics projects',
      category: 'hardware',
      website: 'https://raspberrypi.org',
      isPopular: true,
      order: 2,
    },
    {
      name: 'Python',
      description: 'Programming language ideal for AI and robotics',
      category: 'programming',
      website: 'https://python.org',
      isPopular: true,
      order: 3,
    },
    {
      name: 'ROS (Robot Operating System)',
      description: 'Framework for robot software development',
      category: 'software',
      website: 'https://ros.org',
      isPopular: true,
      order: 4,
    },
    {
      name: 'TensorFlow',
      description: 'Machine learning framework for AI applications',
      category: 'software',
      website: 'https://tensorflow.org',
      isPopular: true,
      order: 5,
    },
    {
      name: 'GitHub',
      description: 'Version control and collaboration platform',
      category: 'platform',
      website: 'https://github.com',
      isPopular: true,
      order: 6,
    },
  ]

  for (const tool of tools) {
    const existing = await prisma.tool.findFirst({
      where: { name: tool.name }
    })
    
    if (existing) {
      await prisma.tool.update({
        where: { id: existing.id },
        data: tool,
      })
    } else {
      await prisma.tool.create({
        data: tool,
      })
    }
  }

  // Seed Resources
  console.log('Seeding resources...')
  const resources = [
    {
      title: 'Arduino Programming Basics',
      description: 'Complete guide to getting started with Arduino programming',
      type: 'tutorial',
      url: 'https://arduino.cc/en/Tutorial/HomePage',
      category: 'programming',
      difficulty: 'beginner',
      isFeatured: true,
      order: 1,
    },
    {
      title: 'Robotics with Raspberry Pi',
      description: 'Build robots using Raspberry Pi and Python',
      type: 'course',
      url: 'https://example.com/raspberry-pi-robotics',
      category: 'robotics',
      difficulty: 'intermediate',
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Machine Learning for Robotics',
      description: 'Apply machine learning techniques in robotics projects',
      type: 'course',
      url: 'https://example.com/ml-robotics',
      category: 'ai',
      difficulty: 'advanced',
      isFeatured: false,
      order: 3,
    },
    {
      title: 'Electronics Fundamentals',
      description: 'Basic electronics concepts for robotics',
      type: 'documentation',
      url: 'https://example.com/electronics-basics',
      category: 'electronics',
      difficulty: 'beginner',
      isFeatured: true,
      order: 4,
    },
    {
      title: 'ROS Tutorial Series',
      description: 'Comprehensive ROS learning path',
      type: 'video',
      url: 'https://example.com/ros-tutorials',
      category: 'robotics',
      difficulty: 'intermediate',
      isFeatured: false,
      order: 5,
    },
  ]

  for (const resource of resources) {
    const existing = await prisma.resource.findFirst({
      where: { title: resource.title }
    })
    
    if (existing) {
      await prisma.resource.update({
        where: { id: existing.id },
        data: resource,
      })
    } else {
      await prisma.resource.create({
        data: resource,
      })
    }
  }

  // Seed Initial Admin User
  console.log('Seeding admin user...')
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@zunobotics.com' }
  })
  
  if (existingAdmin) {
    await prisma.admin.update({
      where: { id: existingAdmin.id },
      data: {
        name: 'ZunoBotics Admin',
        password: hashedPassword,
        role: 'super_admin',
      },
    })
  } else {
    await prisma.admin.create({
      data: {
        email: 'admin@zunobotics.com',
        name: 'ZunoBotics Admin',
        password: hashedPassword,
        role: 'super_admin',
      },
    })
  }

  // Seed Proposal Template
  console.log('Seeding proposal template...')
  const existingTemplate = await prisma.proposalTemplate.findFirst({
    where: { name: 'Default Project Proposal Template' }
  })
  
  if (existingTemplate) {
    await prisma.proposalTemplate.update({
      where: { id: existingTemplate.id },
      data: {
        description: 'Standard template for student project proposals',
        filename: 'ZunoBotics_Project_Proposal_Template.docx',
        version: '1.0',
        isActive: true,
      },
    })
  } else {
    await prisma.proposalTemplate.create({
      data: {
        name: 'Default Project Proposal Template',
        description: 'Standard template for student project proposals',
        filename: 'ZunoBotics_Project_Proposal_Template.docx',
        version: '1.0',
        isActive: true,
      },
    })
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })