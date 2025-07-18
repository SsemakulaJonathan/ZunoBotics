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
  BookOpen,
  Video,
  FileText,
  GraduationCap,
  ExternalLink,
  Star,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  url?: string
  category: string
  difficulty: string
  isExternal: boolean
  isFeatured: boolean
  order: number
  createdAt: string
}

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'tutorial',
    url: '',
    category: 'robotics',
    difficulty: 'beginner',
    isExternal: true,
    isFeatured: false,
    order: 0
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchResources()
  }, [router])

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/resources', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setResources(data.resources)
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingResource ? `/api/admin/resources/${editingResource.id}` : '/api/admin/resources'
      const method = editingResource ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchResources()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save resource:', error)
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      url: resource.url || '',
      category: resource.category,
      difficulty: resource.difficulty,
      isExternal: resource.isExternal,
      isFeatured: resource.isFeatured,
      order: resource.order
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchResources()
      }
    } catch (error) {
      console.error('Failed to delete resource:', error)
    }
  }

  const toggleFeatured = async (resourceId: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })

      if (response.ok) {
        fetchResources()
      }
    } catch (error) {
      console.error('Failed to toggle resource featured status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'tutorial',
      url: '',
      category: 'robotics',
      difficulty: 'beginner',
      isExternal: true,
      isFeatured: false,
      order: 0
    })
    setEditingResource(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial':
        return <BookOpen className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'documentation':
        return <FileText className="h-5 w-5" />
      case 'course':
        return <GraduationCap className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tutorial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'documentation':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'course':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory
    const matchesType = filterType === 'all' || resource.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading resources...</p>
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
                  Learning Resources
                </h1>
                <p className="text-muted-foreground">
                  Manage educational resources and tutorials
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingResource ? 'Update resource information' : 'Add a new learning resource'}
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
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="book">Book</SelectItem>
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
                      placeholder="Enter resource description (max 100 characters)"
                      required
                    />
                    {formData.description.length >= 80 && (
                      <p className="text-sm text-amber-600 mt-1">
                        {100 - formData.description.length} characters remaining
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="robotics">Robotics</SelectItem>
                          <SelectItem value="programming">Programming</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="ai">AI & Machine Learning</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level *</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="url">Resource URL</Label>
                      <Input
                        id="url"
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                        placeholder="https://example.com/resource"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isExternal"
                        checked={formData.isExternal}
                        onCheckedChange={(checked) => setFormData({...formData, isExternal: checked})}
                      />
                      <Label htmlFor="isExternal">External resource</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                      />
                      <Label htmlFor="isFeatured">Featured resource</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingResource ? 'Update Resource' : 'Add Resource'}
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
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="robotics">Robotics</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="ai">AI & ML</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="tutorial">Tutorials</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="course">Courses</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <Badge className={getTypeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.isFeatured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
                      {resource.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {resource.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {resource.description}
                  </p>
                  
                  {resource.url && (
                    <div className="flex items-center text-sm">
                      <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {resource.url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order: {resource.order}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(resource.id, resource.isFeatured)}
                    >
                      <Star className={`h-4 w-4 ${resource.isFeatured ? 'fill-current text-yellow-500' : ''}`} />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
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

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterCategory !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Add your first resource to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}