// components/timeline.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle } from "lucide-react"

interface LaunchTimelineItem {
  id: string
  title: string
  description: string
  year: string
  date?: string
  order: number
  isVisible: boolean
  status: string
}

export default function Timeline() {
  const [timelineItems, setTimelineItems] = useState<LaunchTimelineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const fetchTimelineItems = async () => {
      try {
        const response = await fetch('/api/launch-timeline')
        if (response.ok) {
          const data = await response.json()
          setTimelineItems(data.launchTimelineItems)
        }
      } catch (error) {
        console.error('Error fetching launch timeline items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimelineItems()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <Calendar size={24} />
      case 'in_progress':
        return <Clock size={24} />
      case 'completed':
        return <CheckCircle size={24} />
      default:
        return <Calendar size={24} />
    }
  }

  if (isLoading) {
    return (
      <section className="py-24 bg-gradient-section" aria-labelledby="timeline-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="timeline-heading">Launch Timeline</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ZunoBotics will roll out in phases, starting in Uganda and gradually expanding regionally.
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
    <section className="py-24 bg-gradient-section" aria-labelledby="timeline-heading">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="section-header"
        >
          <h2 id="timeline-heading">Launch Timeline</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ZunoBotics will roll out in phases, starting in Uganda and gradually expanding regionally.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/30"></div>
          {/* Mobile timeline line */}
          <div className="md:hidden absolute left-6 top-0 h-full w-0.5 bg-primary/30"></div>

          {/* Timeline items */}
          <div className="relative">
            {timelineItems.map((item, index) => {
              const align = index % 2 === 0 ? "right" : "left"
              
              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  variants={fadeIn}
                  className={`flex items-center mb-16 ${align === "left" ? "md:flex-row-reverse" : ""}`}
                  role="listitem"
                >
                  {/* Desktop layout */}
                  <div className={`hidden md:block w-1/2 ${align === "left" ? "pr-12 text-right" : "pl-12"}`}>
                    <div className="card-premium p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-accent">{item.year}</p>
                        {item.date && (
                          <p className="text-xs text-muted-foreground">
                            • {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden w-full pl-16">
                    <div className="card-premium p-6 rounded-lg">
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-accent">{item.year}</p>
                        {item.date && (
                          <p className="text-xs text-muted-foreground">
                            • {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline icon - desktop */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>

                  {/* Timeline icon - mobile */}
                  <div className="md:hidden absolute left-0 flex items-center justify-center">
                    <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-primary-foreground">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>

                  <div className="hidden md:block w-1/2"></div>
                </motion.div>
              )
            })}
            
            {/* Fallback when no timeline items */}
            {timelineItems.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Launch Timeline Coming Soon</h3>
                <p className="text-muted-foreground">Timeline items will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}