"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Download, 
  Eye, 
  Check, 
  X, 
  Clock,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

interface ProposalSubmission {
  id: string
  name: string
  email: string
  university: string
  projectTitle: string
  description: string
  filename?: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  reviewNotes?: string
  createdAt: string
}

export default function ProposalManagement() {
  const [proposals, setProposals] = useState<ProposalSubmission[]>([])
  const [filteredProposals, setFilteredProposals] = useState<ProposalSubmission[]>([])
  const [selectedProposal, setSelectedProposal] = useState<ProposalSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reviewNotes, setReviewNotes] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchProposals()
  }, [router])

  useEffect(() => {
    // Filter proposals based on search and status
    let filtered = proposals

    if (searchTerm) {
      filtered = filtered.filter(proposal => 
        proposal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter)
    }

    setFilteredProposals(filtered)
  }, [proposals, searchTerm, statusFilter])

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/admin/proposals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProposals(data.proposals)
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProposalStatus = async (proposalId: string, status: string, notes?: string) => {
    setIsReviewing(true)
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status, reviewNotes: notes })
      })

      if (response.ok) {
        fetchProposals()
        setSelectedProposal(null)
        setReviewNotes('')
      }
    } catch (error) {
      console.error('Failed to update proposal:', error)
    } finally {
      setIsReviewing(false)
    }
  }

  const downloadProposal = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/proposals/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download proposal:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'under_review': return 'default'
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'under_review': return <Eye className="h-4 w-4" />
      case 'approved': return <Check className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading proposals...</p>
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
                  Proposal Management
                </h1>
                <p className="text-muted-foreground">
                  Review and manage student project proposals
                </p>
              </div>
            </div>
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
              placeholder="Search by name, project title, or university..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6">
          {filteredProposals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No proposals found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No proposals have been submitted yet'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {proposal.projectTitle}
                        <Badge variant={getStatusColor(proposal.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(proposal.status)}
                          {proposal.status.replace('_', ' ')}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        By {proposal.name} • {proposal.university} • {new Date(proposal.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Project Description</h4>
                      <p className="text-muted-foreground text-sm">
                        {proposal.description.length > 150 
                          ? `${proposal.description.substring(0, 150)}...`
                          : proposal.description
                        }
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedProposal(proposal)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedProposal?.projectTitle}</DialogTitle>
                            <DialogDescription>
                              Proposal submitted by {selectedProposal?.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedProposal && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Applicant</label>
                                  <p className="text-sm text-muted-foreground">{selectedProposal.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedProposal.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">University</label>
                                  <p className="text-sm text-muted-foreground">{selectedProposal.university}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Badge variant={getStatusColor(selectedProposal.status) as any}>
                                    {selectedProposal.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Project Description</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedProposal.description}
                                </p>
                              </div>

                              {selectedProposal.reviewNotes && (
                                <div>
                                  <label className="text-sm font-medium">Review Notes</label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedProposal.reviewNotes}
                                  </p>
                                </div>
                              )}

                              <div>
                                <label className="text-sm font-medium">Review Notes</label>
                                <Textarea
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add review notes..."
                                  className="mt-1"
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => updateProposalStatus(selectedProposal.id, 'approved', reviewNotes)}
                                  disabled={isReviewing}
                                  className="flex-1"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => updateProposalStatus(selectedProposal.id, 'rejected', reviewNotes)}
                                  disabled={isReviewing}
                                  className="flex-1"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {proposal.filename && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadProposal(proposal.filename!)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}