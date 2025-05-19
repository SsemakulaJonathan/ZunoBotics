// components/projects.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ArrowRight, Github, Users, Award, Filter, Search, FileText, Code, ExternalLink } from "lucide-react"

export default function Projects() {
  const [visibleProjects, setVisibleProjects] = useState(3)
  const [activeFilters, setActiveFilters] = useState({
    university: 'all',
    category: 'all',
    technology: 'all',
    search: ''
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const projects = [
    {
      id: 1,
      title: "Autonomous Irrigation Robot",
      description: "A low-cost robot that automates irrigation in small farms, optimizing water usage and increasing crop yields.",
      image: "/Irrigation_Robot.png?height=300&width=400",
      tags: ["ESP32", "Ultrasonic Sensor", "DC Motor", "Solenoid Valve", "Relay Module", "3D Printing"],
      university: "Makerere University",
      category: "Agriculture",
      impact: "30% increase in crop yields with 40% less water usage",
      contributors: 4,
      repoStars: 12,
      forks: 5,
      dateCompleted: "March 2025",
      repoUrl: "#"
    },
    {
      id: 2,
      title: "Medical Supply Delivery Drone",
      description: "A drone system designed to deliver medical supplies to remote areas with limited road access.",
      image: "/Medical_Drone.png?height=300&width=400",
      tags: ["Pixhawk 6C", "Brushless DC Motors", "GPS Module", "IMU", "ROS", "Computer Vision"],
      university: "Kyambogo University",
      category: "Healthcare",
      impact: "Reduced delivery time from 3 hours to 20 minutes in pilot area",
      contributors: 6,
      repoStars: 18,
      forks: 7,
      dateCompleted: "February 2025",
      repoUrl: "#"
    },
    {
      id: 3,
      title: "Smart Waste Sorting System",
      description: "An automated system that uses computer vision to sort recyclable waste materials.",
      image: "/Waste_Sorting.png?height=300&width=400",
      tags: ["Raspberry PI", "Gemma 3", "ZunoBotics Robot Arm", "Servo Motors"],
      university: "Makerere University",
      category: "Environment",
      impact: "90% accuracy in sorting plastic, metal and paper waste",
      contributors: 3,
      repoStars: 9,
      forks: 2,
      dateCompleted: "April 2025",
      repoUrl: "#"
    },
    {
      id: 4,
      title: "Solar-Powered Water Quality Monitor",
      description: "A device that continuously monitors water quality parameters in community water sources.",
      image: "/Water_Monitor.png?height=300&width=400",
      tags: ["STM32", "Sensors", "LoRa Module"],
      university: "Uganda Martyrs University",
      category: "Environment",
      impact: "Early detection of pollutants in Lake Victoria tributaries",
      contributors: 2,
      repoStars: 7,
      forks: 3,
      dateCompleted: "January 2025",
      repoUrl: "#"
    },
    {
      id: 5,
      title: "Assistive Technology for Visually Impaired",
      description: "A wearable device that helps visually impaired individuals navigate their surroundings.",
      image: "/Visually_Impaired.png?height=300&width=400",
      tags: ["ESP32-CAM", "Ultrasonic Sensors", "Object Detection", "Vibration Motor", "Wearable Tech", "3D Printing"],
      university: "Mbarara University",
      category: "Accessibility",
      impact: "Increased independence for users in pilot testing",
      contributors: 5,
      repoStars: 15,
      forks: 4,
      dateCompleted: "March 2025",
      repoUrl: "#"
    },
    {
      id: 6,
      title: "Automated Poultry Monitoring System",
      description: "A system that monitors temperature, humidity, and feed levels in poultry farms.",
      image: "/Poultry_Monitor.png?height=300&width=400",
      tags: ["STM32", "Load Cell", "DS18B20", "Sensors", "IoT"],
      university: "Kyambogo University",
      category: "Agriculture",
      impact: "15% reduction in chick mortality rates in test deployment",
      contributors: 3,
      repoStars: 8,
      forks: 2,
      dateCompleted: "February 2025",
      repoUrl: "#"
    }
  ]

  const universities = ['all', ...new Set(projects.map(project => project.university))]
  const categories = ['all', ...new Set(projects.map(project => project.category))]
  const technologies = ['all', ...new Set(projects.flatMap(project => project.tags))]

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
    return (
      (activeFilters.university === 'all' || project.university === activeFilters.university) &&
      (activeFilters.category === 'all' || project.category === activeFilters.category) &&
      (activeFilters.technology === 'all' || project.tags.includes(activeFilters.technology)) &&
      (activeFilters.search === '' || 
        project.title.toLowerCase().includes(activeFilters.search) ||
        project.description.toLowerCase().includes(activeFilters.search))
    )
  })

  const showMoreProjects = () => {
    setVisibleProjects(filteredProjects.length)
  }

  return (
    <section id="projects" className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Student Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore innovative open-source projects created by students across Africa.
          </p>
        </motion.div>

        {/* Filter Section */}
        <div className="bg-card border-b py-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              <h2 className="font-semibold text-foreground">Filter Projects:</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                className="w-full sm:w-auto px-4 py-2 border border-input rounded-md bg-card text-foreground"
                value={activeFilters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="all">All Universities</option>
                {universities.filter(u => u !== 'all').map(university => (
                  <option key={university} value={university}>{university}</option>
                ))}
              </select>
              <select
                className="w-full sm:w-auto px-4 py-2 border border-input rounded-md bg-card text-foreground"
                value={activeFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                className="w-full sm:w-auto px-4 py-2 border border-input rounded-md bg-card text-foreground"
                value={activeFilters.technology}
                onChange={(e) => handleFilterChange('technology', e.target.value)}
              >
                <option value="all">All Technologies</option>
                {technologies.filter(t => t !== 'all').map(technology => (
                  <option key={technology} value={technology}>{technology}</option>
                ))}
              </select>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-input rounded-md bg-card text-foreground"
                  onChange={handleSearch}
                />
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <div className="card-premium rounded-lg overflow-hidden h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary hover:bg-primary/80 text-primary-foreground">{project.university}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">{project.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Award size={16} className="mr-1 text-primary" />
                    <span>Impact: {project.impact}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-muted border-muted-foreground/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      <span>{project.contributors} contributors</span>
                    </div>
                    <div className="flex items-center">
                      <Github size={16} className="mr-1" />
                      <span>{project.repoStars} stars</span>
                    </div>
                    <div>Completed: {project.dateCompleted}</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      className="flex-1 btn-elegant flex items-center justify-center"
                      asChild
                    >
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={16} className="mr-2" />
                        View Repository
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center border-primary text-primary hover:bg-primary/10"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleProjects < filteredProjects.length && (
          <div className="text-center mt-12">
            <Button
              onClick={showMoreProjects}
              variant="outline"
              className="px-8 py-6 text-lg rounded-md border-primary/20 text-primary hover:bg-primary/10"
            >
              Load More Projects
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-muted py-16 mt-16">
          <div className="max-w-5xl mx-auto bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-primary text-primary-foreground p-8">
                <h3 className="text-2xl font-bold mb-4">Want to Start Your Own Project?</h3>
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
                  <Button
                    className="btn-elegant flex items-center justify-center"
                  >
                    <FileText size={18} className="mr-2" />
                    Download Proposal Template
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center border-primary text-primary hover:bg-primary/10"
                  >
                    <Code size={18} className="mr-2" />
                    View Project Guidelines
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
