"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Trophy,
  Calendar,
  Target,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

interface Milestone {
  id: string
  title: string
  description: string
  year: string
  date?: string
  type: string
  order: number
  isVisible: boolean
  createdAt: string
}

export default function MilestonesManagement() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    date: '',
    type: 'milestone',
    order: 0,
    isVisible: true
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchMilestones()
  }, [router])

  const fetchMilestones = async () => {
    try {
      const response = await fetch('/api/admin/milestones', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.milestones)
      }
    } catch (error) {
      console.error('Failed to fetch milestones:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMilestone ? `/api/admin/milestones/${editingMilestone.id}` : '/api/admin/milestones'
      const method = editingMilestone ? 'PATCH' : 'POST'

      const submitData = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        fetchMilestones()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save milestone:', error)
    }
  }

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setFormData({
      title: milestone.title,
      description: milestone.description,
      year: milestone.year,
      date: milestone.date ? new Date(milestone.date).toISOString().split('T')[0] : '',
      type: milestone.type,
      order: milestone.order,
      isVisible: milestone.isVisible
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return

    try {
      const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchMilestones()
      }
    } catch (error) {
      console.error('Failed to delete milestone:', error)
    }
  }

  const toggleVisibility = async (milestoneId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isVisible: !isVisible })
      })

      if (response.ok) {
        fetchMilestones()
      }
    } catch (error) {
      console.error('Failed to toggle milestone visibility:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: new Date().getFullYear().toString(),
      date: '',
      type: 'milestone',
      order: 0,
      isVisible: true
    })
    setEditingMilestone(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Target className="h-5 w-5" />
      case 'achievement':
        return <Trophy className="h-5 w-5" />
      case 'event':
        return <Star className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'event':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredMilestones = milestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         milestone.year.includes(searchTerm)
    const matchesType = filterType === 'all' || milestone.type === filterType
    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading milestones...</p>
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
            <div className="flex items-center">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Journey Milestones
                </h1>
                <p className="text-muted-foreground">
                  Manage timeline milestones and achievements
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMilestone ? 'Update milestone information' : 'Add a new milestone to the journey timeline'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description * ({formData.description.length}/100)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setFormData({...formData, description: e.target.value})
                        }
                      }}
                      rows={3}
                      maxLength={100}
                      placeholder="Enter milestone description (max 100 characters)"
                      required
                    />
                    {formData.description.length >= 80 && (
                      <p className="text-sm text-amber-600 mt-1">
                        {100 - formData.description.length} characters remaining
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        placeholder="2024"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Specific Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVisible"
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData({...formData, isVisible: checked})}
                    />
                    <Label htmlFor="isVisible">Visible on timeline</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingMilestone ? 'Update Milestone' : 'Add Milestone'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search milestones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="milestone">Milestones</SelectItem>
              <SelectItem value="achievement">Achievements</SelectItem>
              <SelectItem value="event">Events</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMilestones.map((milestone) => (
            <Card key={milestone.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(milestone.type)}
                    <Badge className={getTypeColor(milestone.type)}>
                      {milestone.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={milestone.isVisible ? 'default' : 'secondary'} className="text-xs">
                      {milestone.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-medium">{milestone.year}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{milestone.title}</CardTitle>
                {milestone.date && (
                  <CardDescription>
                    {new Date(milestone.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {milestone.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order: {milestone.order}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(milestone.id, milestone.isVisible)}
                    >
                      {milestone.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(milestone)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(milestone.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMilestones.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No milestones found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Add your first milestone to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}