'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, Edit, Trash2, Users, Code, School, Globe, Activity, 
  Target, Award, TrendingUp, Search, Filter, Eye, EyeOff 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface ImpactMetric {
  id: string
  icon: string
  count: string
  label: string
  description: string
  order: number
  isVisible: boolean
  createdAt: string
}

export default function ImpactManagement() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMetric, setEditingMetric] = useState<ImpactMetric | null>(null)
  const [formData, setFormData] = useState({
    icon: 'users',
    count: '',
    label: '',
    description: '',
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
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/impact-metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMetrics(data.metrics)
      } else if (response.status === 401) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Failed to fetch impact metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMetric ? `/api/admin/impact-metrics/${editingMetric.id}` : '/api/admin/impact-metrics'
      const method = editingMetric ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchMetrics()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save impact metric:', error)
    }
  }

  const handleEdit = (metric: ImpactMetric) => {
    setEditingMetric(metric)
    setFormData({
      icon: metric.icon,
      count: metric.count,
      label: metric.label,
      description: metric.description,
      order: metric.order,
      isVisible: metric.isVisible
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (metricId: string) => {
    if (!confirm('Are you sure you want to delete this impact metric?')) return

    try {
      const response = await fetch(`/api/admin/impact-metrics/${metricId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        fetchMetrics()
      }
    } catch (error) {
      console.error('Failed to delete impact metric:', error)
    }
  }

  const toggleVisibility = async (metricId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/impact-metrics/${metricId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isVisible: !isVisible })
      })

      if (response.ok) {
        fetchMetrics()
      }
    } catch (error) {
      console.error('Failed to toggle metric visibility:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      icon: 'users',
      count: '',
      label: '',
      description: '',
      order: 0,
      isVisible: true
    })
    setEditingMetric(null)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'users': return <Users size={20} />
      case 'code': return <Code size={20} />
      case 'school': return <School size={20} />
      case 'globe': return <Globe size={20} />
      case 'activity': return <Activity size={20} />
      case 'target': return <Target size={20} />
      case 'award': return <Award size={20} />
      case 'trending-up': return <TrendingUp size={20} />
      default: return <Users size={20} />
    }
  }

  const filteredMetrics = metrics.filter(metric => 
    metric.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.count.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impact Metrics Management</h1>
          <p className="text-muted-foreground">
            Manage the "Our Impact So Far" section metrics displayed to users.
          </p>
        </div>
        <Link href="/admin/dashboard" className="text-primary hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search impact metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Impact Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMetric ? 'Edit Impact Metric' : 'Add New Impact Metric'}
              </DialogTitle>
              <DialogDescription>
                {editingMetric ? 'Update the impact metric information' : 'Add a new metric to showcase ZunoBotics impact'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon *</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({...formData, icon: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="users">👥 Users</SelectItem>
                      <SelectItem value="code">💻 Code</SelectItem>
                      <SelectItem value="school">🏫 School</SelectItem>
                      <SelectItem value="globe">🌍 Globe</SelectItem>
                      <SelectItem value="activity">📈 Activity</SelectItem>
                      <SelectItem value="target">🎯 Target</SelectItem>
                      <SelectItem value="award">🏆 Award</SelectItem>
                      <SelectItem value="trending-up">📊 Trending Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="count">Count/Number *</Label>
                  <Input
                    id="count"
                    value={formData.count}
                    onChange={(e) => setFormData({...formData, count: e.target.value})}
                    placeholder="e.g., 150+, 42, 1.2K"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="label">Label *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="e.g., Students Supported, Projects Completed"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  placeholder="e.g., Across multiple universities in Uganda"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => setFormData({...formData, isVisible: checked})}
                  />
                  <Label htmlFor="isVisible">Visible to users</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingMetric ? 'Update Metric' : 'Add Metric'}
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

      <div className="grid gap-4">
        {filteredMetrics.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No impact metrics found</p>
              <p className="text-muted-foreground">Add your first metric to get started.</p>
            </CardContent>
          </Card>
        ) : (
          filteredMetrics.map((metric) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-full">
                      {getIconComponent(metric.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-primary">{metric.count}</h3>
                        <Badge variant={metric.isVisible ? "default" : "secondary"}>
                          {metric.isVisible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {metric.isVisible ? 'Visible' : 'Hidden'}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-semibold">{metric.label}</h4>
                      <p className="text-muted-foreground">{metric.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Order: {metric.order}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(metric.id, metric.isVisible)}
                    >
                      {metric.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(metric)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(metric.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}