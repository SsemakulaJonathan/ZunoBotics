"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FileText, 
  School, 
  Settings, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    proposals: { total: 0, pending: 0, approved: 0 },
    projects: { total: 0, active: 0 },
    partners: { total: 0 },
    teamMembers: { total: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // Fetch dashboard stats
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const dashboardCards = [
    {
      title: 'Proposal Submissions',
      href: '/admin/proposals',
      icon: FileText,
      stats: [
        { label: 'Total', value: stats.proposals.total, color: 'default' },
        { label: 'Pending', value: stats.proposals.pending, color: 'secondary' },
        { label: 'Approved', value: stats.proposals.approved, color: 'default' }
      ]
    },
    {
      title: 'Student Projects',
      href: '/admin/projects',
      icon: BarChart3,
      stats: [
        { label: 'Total', value: stats.projects.total, color: 'default' },
        { label: 'Active', value: stats.projects.active, color: 'default' }
      ]
    },
    {
      title: 'Team Management',
      href: '/admin/team',
      icon: Users,
      stats: [
        { label: 'Members', value: stats.teamMembers.total, color: 'default' }
      ]
    },
    {
      title: 'Partners',
      href: '/admin/partners',
      icon: School,
      stats: [
        { label: 'Total', value: stats.partners.total, color: 'default' }
      ]
    },
    {
      title: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
      stats: [
        { label: 'Fundraising Goal', value: '$100K', color: 'default' }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ZunoBotics Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your platform content and applications
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {card.stats.map((stat) => (
                      <div key={stat.label} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <Badge variant={stat.color as any}>
                          {stat.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Manage Content
              </CardTitle>
              <CardDescription>
                Add and edit platform content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full justify-start">
                  Student Projects
                </Button>
              </Link>
              <Link href="/admin/team">
                <Button variant="outline" className="w-full justify-start">
                  Team Members
                </Button>
              </Link>
              <Link href="/admin/partners">
                <Button variant="outline" className="w-full justify-start">
                  Partners
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Platform Settings
              </CardTitle>
              <CardDescription>
                Configure platform features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/templates">
                <Button variant="outline" className="w-full justify-start">
                  Proposal Templates
                </Button>
              </Link>
              <Link href="/admin/milestones">
                <Button variant="outline" className="w-full justify-start">
                  Journey Milestones
                </Button>
              </Link>
              <Link href="/admin/launch-timeline">
                <Button variant="outline" className="w-full justify-start">
                  Launch Timeline
                </Button>
              </Link>
              <Link href="/admin/impact">
                <Button variant="outline" className="w-full justify-start">
                  Impact Metrics
                </Button>
              </Link>
              <Link href="/admin/tools">
                <Button variant="outline" className="w-full justify-start">
                  Tools & Technologies
                </Button>
              </Link>
              <Link href="/admin/resources">
                <Button variant="outline" className="w-full justify-start">
                  Resources
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest platform activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  New proposal submitted
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Project approved
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  New partner added
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}