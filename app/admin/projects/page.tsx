"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Github, 
  ExternalLink,
  Users,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Upload
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  impact?: string
  image?: string
  tags: string[]
  university: string
  contributors: number
  repoStars: number
  githubUrl?: string
  demoUrl?: string
  dateCompleted?: string
  category?: string
  technology: string[]
  status: string
  createdAt: string
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    impact: '',
    image: '',
    tags: '',
    university: '',
    contributors: 1,
    repoStars: 0,
    githubUrl: '',
    demoUrl: '',
    dateCompleted: '',
    category: '',
    technology: '',
    status: 'active'
  })
  const router = useRouter()

  const universities = [
    'Makerere University',
    'Kyambogo University',
    'Uganda Martyrs University',
    'Mbarara University of Science and Technology',
    'University of Rwanda',
    'Other'
  ]

  const categories = [
    'Agriculture',
    'Healthcare',
    'Environment',
    'Education',
    'Accessibility',
    'IoT',
    'AI/ML',
    'Robotics',
    'Other'
  ]

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchProjects()
  }, [router])

  useEffect(() => {
    // Filter projects based on search and status
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      technology: formData.technology.split(',').map(tech => tech.trim()).filter(Boolean),
      contributors: Number(formData.contributors),
      repoStars: Number(formData.repoStars)
    }

    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects'
      const method = editingProject ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(projectData)
      })

      if (response.ok) {
        fetchProjects()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save project:', error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      impact: project.impact || '',
      image: project.image || '',
      tags: project.tags.join(', '),
      university: project.university,
      contributors: project.contributors,
      repoStars: project.repoStars,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      dateCompleted: project.dateCompleted || '',
      category: project.category || '',
      technology: project.technology.join(', '),
      status: project.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      impact: '',
      image: '',
      tags: '',
      university: '',
      contributors: 1,
      repoStars: 0,
      githubUrl: '',
      demoUrl: '',
      dateCompleted: '',
      category: '',
      technology: '',
      status: 'active'
    })
    setEditingProject(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading projects...</p>
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
                  Student Projects
                </h1>
                <p className="text-muted-foreground">
                  Manage student project showcase
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject ? 'Update project information' : 'Add a new student project to the showcase'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Project Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="university">University *</Label>
                      <Select value={formData.university} onValueChange={(value) => setFormData({...formData, university: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="contributors">Contributors</Label>
                      <Input
                        id="contributors"
                        type="number"
                        min="1"
                        value={formData.contributors}
                        onChange={(e) => setFormData({...formData, contributors: parseInt(e.target.value) || 1})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="repoStars">Repository Stars</Label>
                      <Input
                        id="repoStars"
                        type="number"
                        min="0"
                        value={formData.repoStars}
                        onChange={(e) => setFormData({...formData, repoStars: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateCompleted">Date Completed</Label>
                      <Input
                        id="dateCompleted"
                        value={formData.dateCompleted}
                        onChange={(e) => setFormData({...formData, dateCompleted: e.target.value})}
                        placeholder="e.g., March 2024"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="impact">Project Impact</Label>
                    <Textarea
                      id="impact"
                      value={formData.impact}
                      onChange={(e) => setFormData({...formData, impact: e.target.value})}
                      rows={2}
                      placeholder="e.g., 30% increase in crop yields with 40% less water usage"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="/path/to/image.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="IoT, Agriculture, Sensors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="technology">Technologies (comma-separated)</Label>
                    <Input
                      id="technology"
                      value={formData.technology}
                      onChange={(e) => setFormData({...formData, technology: e.target.value})}
                      placeholder="Arduino, Python, Machine Learning"
                    />
                  </div>

                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div>
                    <Label htmlFor="demoUrl">Demo URL</Label>
                    <Input
                      id="demoUrl"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                      placeholder="https://project-demo.com"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingProject ? 'Update Project' : 'Add Project'}
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.image && (
                <div className="aspect-video relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.university}</CardDescription>
                  </div>
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {project.contributors}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {project.repoStars}
                    </div>
                    {project.dateCompleted && (
                      <span>{project.dateCompleted}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>

                  {(project.githubUrl || project.demoUrl) && (
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </a>
                      )}
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No projects match your search criteria'
                  : 'No projects found. Add your first project!'
                }
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}