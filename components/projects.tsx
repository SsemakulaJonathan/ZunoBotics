// components/projects.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, Github, Users, Award, Filter, Search, FileText, Code, ExternalLink, Upload, Send, X } from "lucide-react"

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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleProjects, setVisibleProjects] = useState(3)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())
  const [activeFilters, setActiveFilters] = useState({
    university: 'all',
    category: 'all',
    technology: 'all',
    search: ''
  })
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposalForm, setProposalForm] = useState({
    name: '',
    email: '',
    university: '',
    projectTitle: '',
    description: '',
    file: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableUniversities, setAvailableUniversities] = useState<Array<{id: string, name: string}>>([])
  const [availableCategories, setAvailableCategories] = useState<Array<{id: string, name: string}>>([])

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities')
        if (response.ok) {
          const data = await response.json()
          setAvailableUniversities(data.universities || [])
        }
      } catch (error) {
        console.error('Error fetching universities:', error)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setAvailableCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchProjects()
    fetchUniversities()
    fetchCategories()
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const universities = ['all', ...new Set(projects.map(project => project.university))]
  const categories = ['all', ...new Set(projects.map(project => project.category).filter(Boolean))]
  const technologies = ['all', ...new Set(projects.flatMap(project => project.technology || project.tags || []))]

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [filterType]: value
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveFilters({
      ...activeFilters,
      search: e.target.value.toLowerCase()
    })
  }

  const filteredProjects = projects.filter(project => {
    const matchesUniversity = activeFilters.university === 'all' || project.university === activeFilters.university
    const matchesCategory = activeFilters.category === 'all' || project.category === activeFilters.category
    const matchesTechnology = activeFilters.technology === 'all' || 
      (project.technology && project.technology.includes(activeFilters.technology)) ||
      (project.tags && project.tags.includes(activeFilters.technology))
    const matchesSearch = activeFilters.search === '' || 
      project.title.toLowerCase().includes(activeFilters.search) ||
      project.description.toLowerCase().includes(activeFilters.search) ||
      (project.technology && project.technology.some(tech => tech.toLowerCase().includes(activeFilters.search))) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(activeFilters.search)))

    return matchesUniversity && matchesCategory && matchesTechnology && matchesSearch
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or DOCX file')
        return
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      setProposalForm({
        ...proposalForm,
        file
      })
    }
  }

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Frontend validation
    if (!proposalForm.name || !proposalForm.email || !proposalForm.university || !proposalForm.projectTitle || !proposalForm.description) {
      alert('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', proposalForm.name)
      formData.append('email', proposalForm.email)
      formData.append('university', proposalForm.university)
      formData.append('projectTitle', proposalForm.projectTitle)
      formData.append('description', proposalForm.description)
      if (proposalForm.file) {
        formData.append('file', proposalForm.file)
      }

      const response = await fetch('/api/proposals', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert('Proposal submitted successfully!')
        setShowProposalForm(false)
        setProposalForm({
          name: '',
          email: '',
          university: '',
          projectTitle: '',
          description: '',
          file: null
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit proposal')
      }
    } catch (error) {
      console.error('Error submitting proposal:', error)
      alert('Failed to submit proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadTemplate = () => {
    // This would download the proposal template
    window.open('/api/proposals/template', '_blank')
  }

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  return (
    <section className="py-24 bg-background" id="projects">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-muted text-muted-foreground">Student Innovation</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Student Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the innovative robotics and automation projects created by African students. 
            Each project is open-source and available for learning and collaboration.
          </p>
        </motion.div>


        {/* Filters */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={fadeIn}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter Projects:</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{filteredProjects.length} Projects</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={activeFilters.search}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            
            <Select value={activeFilters.university} onValueChange={(value) => handleFilterChange('university', value)}>
              <SelectTrigger>
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                {universities.map(university => (
                  <SelectItem key={university} value={university}>
                    {university === 'all' ? 'All Universities' : university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeFilters.technology} onValueChange={(value) => handleFilterChange('technology', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                {technologies.map(tech => (
                  <SelectItem key={tech} value={tech}>
                    {tech === 'all' ? 'All Technologies' : tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground mb-4">No projects found matching your criteria.</p>
            <Button variant="outline" onClick={() => setActiveFilters({ university: 'all', category: 'all', technology: 'all', search: '' })}>
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredProjects.slice(0, visibleProjects).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  variants={fadeIn}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={project.image || "/images/projects/default-project.png"}
                        alt={project.title}
                        width={400}
                        height={250}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-blue-600 text-white">
                          {project.university}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-foreground">
                          {project.category || 'General'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="mb-4">
                          <p className={`text-muted-foreground ${expandedDescriptions.has(project.id) ? '' : 'line-clamp-4'}`}>
                            {project.description}
                          </p>
                          {project.description.length > 200 && (
                            <button
                              onClick={() => toggleDescription(project.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1 font-medium"
                            >
                              {expandedDescriptions.has(project.id) ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                        
                        {project.impact && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                            <h4 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">Impact</h4>
                            <div className="text-sm text-green-700 dark:text-green-300">
                              {project.impact.includes('\n') ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {project.impact.split('\n').filter(line => line.trim()).map((line, index) => (
                                    <li key={index}>{line.trim()}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{project.impact}</p>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(project.technology || project.tags || []).slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {(project.technology?.length || project.tags?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(project.technology?.length || project.tags?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            {project.contributors && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{project.contributors}</span>
                              </div>
                            )}
                            {project.repoStars && (
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4" />
                                <span>{project.repoStars}</span>
                              </div>
                            )}
                          </div>
                          <span>{project.dateCompleted}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </a>
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {visibleProjects < filteredProjects.length && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                variants={fadeIn}
                className="text-center"
              >
                <Button 
                  onClick={() => setVisibleProjects(prev => prev + 3)}
                  variant="outline"
                  size="lg"
                  className="group"
                >
                  View More Projects
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}
          </>
        )}


        {/* Proposal Form Modal */}
        {showProposalForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Submit Project Proposal</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowProposalForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <form onSubmit={handleProposalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={proposalForm.name}
                      onChange={(e) => setProposalForm({...proposalForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={proposalForm.email}
                      onChange={(e) => setProposalForm({...proposalForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="university">University *</Label>
                  <Select value={proposalForm.university} onValueChange={(value) => setProposalForm({...proposalForm, university: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUniversities.map(uni => (
                        <SelectItem key={uni.id} value={uni.name}>{uni.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    value={proposalForm.projectTitle}
                    onChange={(e) => setProposalForm({...proposalForm, projectTitle: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    value={proposalForm.description}
                    onChange={(e) => setProposalForm({...proposalForm, description: e.target.value})}
                    rows={8}
                    required
                    placeholder="Provide a detailed description of your project, including its objectives, methodology, expected outcomes, and potential impact..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="file">Project Proposal Document (PDF or DOCX, max 10MB)</Label>
                  <div className="mt-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {proposalForm.file && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {proposalForm.file.name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Proposal
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowProposalForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}