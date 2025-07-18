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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  User,
  Mail,
  Linkedin,
  Github,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  image?: string
  email?: string
  linkedin?: string
  github?: string
  order: number
  isActive: boolean
  createdAt: string
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image: '',
    email: '',
    linkedin: '',
    github: '',
    order: 0,
    isActive: true
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchTeamMembers()
  }, [router])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers)
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMember ? `/api/admin/team/${editingMember.id}` : '/api/admin/team'
      const method = editingMember ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchTeamMembers()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save team member:', error)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      github: member.github || '',
      order: member.order,
      isActive: member.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchTeamMembers()
      }
    } catch (error) {
      console.error('Failed to delete team member:', error)
    }
  }

  const toggleActive = async (memberId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        fetchTeamMembers()
      }
    } catch (error) {
      console.error('Failed to toggle member status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      description: '',
      image: '',
      email: '',
      linkedin: '',
      github: '',
      order: 0,
      isActive: true
    })
    setEditingMember(null)
  }

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading team members...</p>
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
                  Team Management
                </h1>
                <p className="text-muted-foreground">
                  Manage team members and their information
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMember ? 'Update team member information' : 'Add a new member to the team'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        placeholder="e.g., Founder & Lead Engineer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description * ({formData.description.length}/200)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setFormData({...formData, description: e.target.value})
                        }
                      }}
                      rows={3}
                      required
                      maxLength={200}
                      placeholder="Enter team member description (max 200 characters)"
                    />
                    {formData.description.length >= 180 && (
                      <p className="text-sm text-amber-600 mt-1">
                        {200 - formData.description.length} characters remaining
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="image">Profile Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="/images/team/member.jpg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="member@zunobotics.com"
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active (visible on website)</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingMember ? 'Update Team Member' : 'Add Team Member'}
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
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  {member.image ? (
                    <div className="w-20 h-20 relative">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute -top-2 -right-2">
                    <Badge variant={member.isActive ? 'default' : 'secondary'} className="text-xs">
                      {member.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {member.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order: {member.order}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(member.id, member.isActive)}
                    >
                      {member.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  {(member.email || member.linkedin || member.github) && (
                    <div className="flex gap-2">
                      {member.email && (
                        <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No team members found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'Add your first team member to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}