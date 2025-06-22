// components/tools.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Microchip, Monitor, Cpu, Printer, Code2, Eye, Wrench, GitBranch, 
  Thermometer, Video, Battery, Cpu as FPGA, Database, Cloud, Bot, 
  Search, Filter, Star, ExternalLink
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Tool {
  id: string
  name: string
  description: string
  useCase?: string
  category: string
  icon?: string
  website?: string
  isPopular: boolean
  order: number
}

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools')
        if (response.ok) {
          const data = await response.json()
          setTools(data.tools)
        }
      } catch (error) {
        console.error('Error fetching tools:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'programming':
        return <Code2 size={40} className="text-primary" />
      case 'hardware':
        return <Cpu size={40} className="text-primary" />
      case 'software':
        return <Wrench size={40} className="text-primary" />
      case 'platform':
        return <Cloud size={40} className="text-primary" />
      default:
        return <Wrench size={40} className="text-primary" />
    }
  }

  const categories = ["all", ...new Set(tools.map(tool => tool.category))]

  const filteredTools = (type: string) =>
    tools.filter(tool => {
      const matchesType = type === "all" || 
        (type === "hardware" && (tool.category === "hardware")) ||
        (type === "software" && (tool.category === "programming" || tool.category === "software" || tool.category === "platform"))
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory
      const matchesSearch = searchTerm === "" ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesCategory && matchesSearch
    })

  if (isLoading) {
    return (
      <section id="tools" className="py-24 bg-background" aria-labelledby="tools-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="tools-heading" className="text-4xl md:text-5xl">
              Tools & Technologies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ZunoBotics equips innovators with an extensive suite of open-source hardware and software tools.
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
    <section id="tools" className="py-24 bg-background" aria-labelledby="tools-heading">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="section-header"
        >
          <h2 id="tools-heading" className="text-4xl md:text-5xl">
            Tools & Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ZunoBotics equips innovators with an extensive suite of open-source hardware and software tools spearheading cutting-edge robotics and automation projects.
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Filter Tools:</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <select
              className="px-4 py-2 border rounded-md bg-card text-foreground focus:ring-2 focus:ring-ring"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md bg-card text-foreground focus:ring-2 focus:ring-ring"
              />
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="hardware" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-muted p-1 rounded-full">
            <TabsTrigger
              value="hardware"
              className="rounded-full py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Hardware
            </TabsTrigger>
            <TabsTrigger
              value="software"
              className="rounded-full py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Software
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hardware">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools("hardware").length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No hardware tools found.</p>
                </div>
              ) : (
                filteredTools("hardware").map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={fadeIn}
                    className="group"
                  >
                    <div className="card-premium p-8 rounded-lg h-full">
                      <div className="mb-6">{getCategoryIcon(tool.category)}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-2xl font-bold text-primary">{tool.name}</h3>
                        {tool.isPopular && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{tool.description}</p>
                      {tool.useCase && (
                        <Badge className="bg-secondary text-secondary-foreground mb-4 block">
                          Use Case: {tool.useCase}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary">
                          {tool.category}
                        </Badge>
                        {tool.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={tool.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="software">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools("software").length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No software tools found.</p>
                </div>
              ) : (
                filteredTools("software").map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={fadeIn}
                    className="group"
                  >
                    <div className="card-premium p-8 rounded-lg h-full">
                      <div className="mb-6">{getCategoryIcon(tool.category)}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-2xl font-bold text-primary">{tool.name}</h3>
                        {tool.isPopular && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{tool.description}</p>
                      {tool.useCase && (
                        <Badge className="bg-secondary text-secondary-foreground mb-4 block">
                          Use Case: {tool.useCase}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge className="bg-primary/10 text-primary">
                          {tool.category}
                        </Badge>
                        {tool.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={tool.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}