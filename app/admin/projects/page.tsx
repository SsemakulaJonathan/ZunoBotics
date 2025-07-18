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
  Upload,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  impact?: string
  image?: string
  tags: string[]
  university: string
  contributors?: number
  repoStars?: number
  githubUrl?: string
  demoUrl?: string
  category?: string
  technology: string[]
  dateCompleted?: string
  status: string
}

export default function AdminProjectsPage() {
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
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'universities'>('projects')
  const [newCategory, setNewCategory] = useState('')
  const [newUniversity, setNewUniversity] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingUniversity, setEditingUniversity] = useState<string | null>(null)
  const router = useRouter()

  const [universities, setUniversities] = useState<Array<{id: string, name: string}>>([])
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([])
  const [universitiesLoaded, setUniversitiesLoaded] = useState(false)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    fetchProjects()
    fetchCategories()
    fetchUniversities()
  }, [router])

  useEffect(() => {
    let filtered = projects
    
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }
    
    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
        setCategoriesLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchUniversities = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/universities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || [])
        setUniversitiesLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
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
      const token = localStorage.getItem('adminToken')
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects'
      const method = editingProject ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
      })
      
      if (response.ok) {
        fetchProjects()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving project:', error)
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
      contributors: project.contributors || 1,
      repoStars: project.repoStars || 0,
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      dateCompleted: project.dateCompleted || '',
      category: project.category || '',
      technology: project.technology.join(', '),
      status: project.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch(`/api/admin/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          fetchProjects()
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
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

  // Category management functions
  const addCategory = async () => {
    if (!newCategory.trim()) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.trim() })
      })
      
      if (response.ok) {
        setNewCategory('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const updateCategory = async (categoryId: string, newName: string) => {
    if (!newName.trim()) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      })
      
      if (response.ok) {
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // University management functions
  const addUniversity = async () => {
    if (!newUniversity.trim()) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newUniversity.trim() })
      })
      
      if (response.ok) {
        setNewUniversity('')
        fetchUniversities()
      }
    } catch (error) {
      console.error('Error adding university:', error)
    }
  }

  const updateUniversity = async (universityId: string, newName: string) => {
    if (!newName.trim()) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      })
      
      if (response.ok) {
        setEditingUniversity(null)
        fetchUniversities()
      }
    } catch (error) {
      console.error('Error updating university:', error)
    }
  }

  const deleteUniversity = async (universityId: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/universities/${universityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchUniversities()
      }
    } catch (error) {
      console.error('Error deleting university:', error)
    }
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
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'projects' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('projects')}
                  size="sm"
                >
                  Projects
                </Button>
                <Button 
                  variant={activeTab === 'categories' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('categories')}
                  size="sm"
                >
                  Categories
                </Button>
                <Button 
                  variant={activeTab === 'universities' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('universities')}
                  size="sm"
                >
                  Universities
                </Button>
              </div>
              {activeTab === 'projects' && (
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
                        {editingProject ? 'Update the project details below.' : 'Fill in the project details below.'}
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
                          <Select onValueChange={(value) => setFormData({...formData, university: value})} value={formData.university}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select university" />
                            </SelectTrigger>
                            <SelectContent>
                              {universities.map((uni) => (
                                <SelectItem key={uni.id} value={uni.name}>{uni.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={(value) => setFormData({...formData, category: value})} value={formData.category}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
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
                            onChange={(e) => setFormData({...formData, contributors: parseInt(e.target.value)})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="repoStars">Repository Stars</Label>
                          <Input
                            id="repoStars"
                            type="number"
                            min="0"
                            value={formData.repoStars}
                            onChange={(e) => setFormData({...formData, repoStars: parseInt(e.target.value)})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select onValueChange={(value) => setFormData({...formData, status: value})} value={formData.status}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
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

                        <div className="col-span-2">
                          <Label htmlFor="description">Description * ({formData.description.length}/450)</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => {
                              if (e.target.value.length <= 450) {
                                setFormData({...formData, description: e.target.value})
                              }
                            }}
                            rows={3}
                            required
                            maxLength={450}
                            placeholder="Enter project description (max 450 characters)"
                          />
                          {formData.description.length >= 400 && (
                            <p className="text-sm text-amber-600 mt-1">
                              {450 - formData.description.length} characters remaining
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="impact">Project Impact ({formData.impact.length}/400)</Label>
                          <Textarea
                            id="impact"
                            value={formData.impact}
                            onChange={(e) => {
                              if (e.target.value.length <= 400) {
                                setFormData({...formData, impact: e.target.value})
                              }
                            }}
                            rows={2}
                            maxLength={400}
                            placeholder="Enter project impact - use line breaks for bullet points (max 400 characters)"
                          />
                          {formData.impact.length >= 350 && (
                            <p className="text-sm text-amber-600 mt-1">
                              {400 - formData.impact.length} characters remaining
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="image">Project Image</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  setFormData({...formData, image: event.target?.result as string})
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                          />
                          {formData.image && (
                            <div className="mt-2">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="h-20 w-20 object-cover rounded-md border" 
                              />
                            </div>
                          )}
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="IoT, Agriculture, Sensors"
                          />
                        </div>

                        <div className="col-span-2">
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
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingProject ? 'Update Project' : 'Add Project'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'projects' && (
          <div>
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
                <SelectTrigger className="w-48">
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
                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'}>
                        {project.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(project)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.university} • {project.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    {project.image && (
                      <div className="mb-3">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{project.tags.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        {project.contributors && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{project.contributors}</span>
                          </div>
                        )}
                        {project.repoStars && project.repoStars > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{project.repoStars}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <Github className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Manage Categories
                  </h2>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      className="w-48"
                    />
                    <Button onClick={addCategory} disabled={!newCategory.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="flex justify-between items-center">
                        {editingCategory === category.id ? (
                          <Input
                            defaultValue={category.name}
                            onBlur={(e) => updateCategory(category.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateCategory(category.id, e.currentTarget.value)
                              }
                            }}
                            className="flex-1 mr-2"
                          />
                        ) : (
                          <span className="text-sm font-medium">{category.name}</span>
                        )}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {category.name !== 'Other' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Manage Universities
                  </h2>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter new university"
                      value={newUniversity}
                      onChange={(e) => setNewUniversity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addUniversity()}
                      className="w-48"
                    />
                    <Button onClick={addUniversity} disabled={!newUniversity.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {universities.map((university) => (
                    <Card key={university.id} className="p-4">
                      <div className="flex justify-between items-center">
                        {editingUniversity === university.id ? (
                          <Input
                            defaultValue={university.name}
                            onBlur={(e) => updateUniversity(university.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateUniversity(university.id, e.currentTarget.value)
                              }
                            }}
                            className="flex-1 mr-2"
                          />
                        ) : (
                          <span className="text-sm font-medium">{university.name}</span>
                        )}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUniversity(editingUniversity === university.id ? null : university.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {university.name !== 'Other' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUniversity(university.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}