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
  Search,
  ArrowLeft,
  Building,
  Globe,
  MapPin,
  University,
  Building2,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Partner {
  id: string
  name: string
  logo?: string
  website?: string
  description?: string
  type: string
  location?: string
  createdAt: string
}

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    description: '',
    type: 'university',
    location: ''
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchPartners()
  }, [router])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/partners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPartners(data.partners)
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPartner ? `/api/admin/partners/${editingPartner.id}` : '/api/admin/partners'
      const method = editingPartner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchPartners()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save partner:', error)
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      logo: partner.logo || '',
      website: partner.website || '',
      description: partner.description || '',
      type: partner.type,
      location: partner.location || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (partnerId: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchPartners()
      }
    } catch (error) {
      console.error('Failed to delete partner:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      logo: '',
      website: '',
      description: '',
      type: 'university',
      location: ''
    })
    setEditingPartner(null)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'university':
        return <University className="h-5 w-5" />
      case 'corporate':
        return <Building2 className="h-5 w-5" />
      case 'ngo':
        return <Heart className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'university':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'corporate':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'ngo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || partner.type === filterType
    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading partners...</p>
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
                  Partners Management
                </h1>
                <p className="text-muted-foreground">
                  Manage university and corporate partnerships
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPartner ? 'Update partner information' : 'Add a new partner organization'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Partner Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Partner Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university">University</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="ngo">NGO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="logo">Logo URL</Label>
                      <Input
                        id="logo"
                        value={formData.logo}
                        onChange={(e) => setFormData({...formData, logo: e.target.value})}
                        placeholder="/images/partners/logo.png"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://partner.com"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingPartner ? 'Update Partner' : 'Add Partner'}
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
              placeholder="Search partners..."
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
              <SelectItem value="university">Universities</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="ngo">NGOs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  {partner.logo ? (
                    <div className="w-16 h-16 relative">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      {getTypeIcon(partner.type)}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg">{partner.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={getTypeColor(partner.type)}>
                    {partner.type}
                  </Badge>
                  {partner.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {partner.location}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partner.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {partner.description}
                    </p>
                  )}
                  
                  {partner.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {partner.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
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

        {filteredPartners.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No partners found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Add your first partner to get started'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}