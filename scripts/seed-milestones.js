// Simple script to add initial milestones via API
// This can be run manually to populate the database

const milestones = [
  {
    title: 'ZunoBotics Founded',
    description: 'Established with the vision to empower African innovation through robotics.',
    year: '2023',
    date: '2023-01-15',
    type: 'milestone',
    order: 1,
    isVisible: true
  },
  {
    title: 'First University Partnership',
    description: 'Partnered with Makerere University to launch our first pilot program.',
    year: '2023',
    date: '2023-03-20',
    type: 'achievement',
    order: 2,
    isVisible: true
  },
  {
    title: 'Open Source Initiative Launch',
    description: 'Launched our open-source platform for sharing robotics projects.',
    year: '2023',
    date: '2023-06-10',
    type: 'milestone',
    order: 3,
    isVisible: true
  },
  {
    title: '50 Students Supported',
    description: 'Reached milestone of supporting 50+ students across multiple universities.',
    year: '2024',
    date: '2024-01-01',
    type: 'achievement',
    order: 4,
    isVisible: true
  },
  {
    title: 'Pilot at Makerere and Kyambogo Universities',
    description: 'Establish initial presence, set up small labs, recruit mentors, and begin outreach.',
    year: '2025',
    date: '2025-03-01',
    type: 'milestone',
    order: 5,
    isVisible: true
  },
  {
    title: 'Evaluation and Adjustment',
    description: 'Assess pilot success, gather feedback, and refine processes based on lessons learned.',
    year: 'Late 2025',
    date: '2025-10-01',
    type: 'milestone',
    order: 6,
    isVisible: true
  },
  {
    title: 'Expansion to More Ugandan Universities',
    description: 'Expand to other Ugandan universities and technical institutes.',
    year: '2026',
    date: '2026-06-01',
    type: 'milestone',
    order: 7,
    isVisible: true
  },
  {
    title: 'Regional Outreach to Rwanda and East Africa',
    description: 'Extend to neighboring countries, starting with Rwanda.',
    year: '2027',
    date: '2027-01-01',
    type: 'milestone',
    order: 8,
    isVisible: true
  }
]

console.log('Timeline milestones ready to be added via admin interface:')
console.log(JSON.stringify(milestones, null, 2))
console.log('\nAdmin can use these to populate the timeline through /admin/milestones')