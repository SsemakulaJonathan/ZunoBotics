// components/operational-model.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, FileText, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react" 

export default function OperationalModel() {
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Handle hash navigation
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash
      if (hash === '#get-involved') {
        setTimeout(() => {
          const element = document.getElementById('get-involved')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }

    // Check hash on mount
    handleHashScroll()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashScroll)
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll)
    }
  }, [])

  const availableUniversities = [
    'Makerere University',
    'Kyambogo University',
    'Uganda Martyrs University',
    'Mbarara University of Science and Technology',
    'Busitema University',
    'Islamic University in Uganda',
    'Gulu University',
    'Mbarara University',
    'University of Rwanda',
    'Kigali Institute of Science and Technology',
    'Other'
  ]

  const downloadTemplate = () => {
    // This would download the proposal template
    window.open('/api/proposals/template', '_blank')
  }

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

  const steps = [
    {
      title: "Application & Project Selection",
      description:
        "Students submit project proposals that are reviewed based on relevance, feasibility, and educational value.",
    },
    {
      title: "Support & Resource Allocation",
      description: "Approved teams gain access to hardware components, tools, workspace, and mentorship.",
    },
    {
      title: "Open-Source Compliance",
      description: "All projects must maintain public repositories with code, schematics, and documentation.",
    },
    {
      title: "Collaborative Development",
      description:
        "Teams collaborate, share progress, and contribute to a growing ecosystem of open-source innovation.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-muted text-muted-foreground">Our Process</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our operational model is designed to support students while ensuring open-source development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeIn}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-2xl"></div>
            <div className="relative z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
              <img
                src="/robot-arm-3d.png"
                alt="Students working on robotics project"
                className="rounded-xl w-full object-cover h-[450px]"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-xl p-3 z-20 border border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-foreground">Active Development</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-12 left-1/2 w-0.5 h-16 bg-muted -translate-x-1/2"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action - Get Involved */}
        <motion.div
          id="get-involved"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={fadeIn}
          className="mt-24"
        >
          <div className="max-w-5xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-primary text-primary-foreground p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
                <p className="mb-6">
                  ZunoBotics provides components, workspace, mentorship, and support for student innovation projects.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-primary-foreground/20 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                    Access to hardware components
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-foreground/20 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                    Prototyping equipment (3D printers, PCB fab)
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-foreground/20 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                    Experienced mentors and guidance
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-foreground/20 p-1 rounded-full mr-2 mt-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </div>
                    Project management support
                  </li>
                </ul>
              </div>
              <div className="md:w-2/3 p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">How to Apply</h3>
                <ol className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-primary font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Download the Project Proposal Template</h4>
                      <p className="text-muted-foreground">
                        Our template guides you through articulating your project idea, goals, and resource requirements.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-primary font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Submit Your Proposal</h4>
                      <p className="text-muted-foreground">
                        Complete the proposal and submit it to ZunoBotics for review by our selection committee.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-primary font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Project Kickoff</h4>
                      <p className="text-muted-foreground">
                        If approved, you'll receive resources, be assigned a mentor, and create your project repository.
                      </p>
                    </div>
                  </li>
                </ol>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Download Proposal Template
                  </Button>
                  <Button onClick={() => setShowProposalForm(true)} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit Proposal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

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
                        <SelectItem key={uni} value={uni}>{uni}</SelectItem>
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
                    rows={4}
                    required
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