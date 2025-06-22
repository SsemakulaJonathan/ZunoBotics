// components/tutorials.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Video, FileText, GraduationCap, ExternalLink, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
}

export default function Tutorials() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/resources')
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResources()
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial':
        return <BookOpen size={40} className="text-primary" />
      case 'video':
        return <Video size={40} className="text-primary" />
      case 'documentation':
        return <FileText size={40} className="text-primary" />
      case 'course':
        return <GraduationCap size={40} className="text-primary" />
      default:
        return <BookOpen size={40} className="text-primary" />
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

  if (isLoading) {
    return (
      <section id="tutorials" className="py-24 bg-background" aria-labelledby="tutorials-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="tutorials-heading" className="text-4xl md:text-5xl">
              Tutorials & Guides
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access our comprehensive library of tutorials to kickstart your robotics journey.
            </p>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="tutorials" className="py-24 bg-background" aria-labelledby="tutorials-heading">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="section-header"
        >
          <h2 id="tutorials-heading" className="text-4xl md:text-5xl">
            Tutorials & Guides
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access our comprehensive library of tutorials to kickstart your robotics journey with ZunoBotics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No resources found.</p>
            </div>
          ) : (
            resources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="group"
              >
                <div className="card-premium p-8 rounded-lg h-full">
                  <div className="mb-6">{getTypeIcon(resource.type)}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-primary">{resource.title}</h3>
                    {resource.isFeatured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getDifficultyColor(resource.difficulty)} variant="outline">
                      {resource.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{resource.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    asChild
                  >
                    <a 
                      href={resource.url || "#"} 
                      target={resource.isExternal ? "_blank" : "_self"} 
                      rel={resource.isExternal ? "noopener noreferrer" : undefined}
                    >
                      View {resource.type}
                      {resource.isExternal && <ExternalLink className="h-4 w-4 ml-2" />}
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}