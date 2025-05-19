// components/tools.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Microchip, Monitor, Cpu, Printer, Code2, Eye, Wrench, GitBranch, 
  Thermometer, Video, Battery, Cpu as FPGA, Database, Cloud, Bot, 
  Search, Filter 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function Tools() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tools = {
    hardware: [
      {
        category: "Microcontrollers",
        items: [
          {
            name: "Arduino",
            description: "Open-source microcontroller platform for beginners and advanced users.",
            icon: <Microchip size={40} className="text-primary" />,
            useCase: "Prototyping simple robots and IoT devices.",
          },
          {
            name: "Raspberry Pi",
            description: "Single-board computer for complex processing and networking.",
            icon: <Monitor size={40} className="text-primary" />,
            useCase: "Running computer vision or ROS-based robotics projects.",
          },
          {
            name: "STM32",
            description: "High-performance microcontrollers for embedded systems.",
            icon: <Cpu size={40} className="text-primary" />,
            useCase: "Real-time control in advanced robotics applications.",
          },
          {
            name: "ESP32",
            description: "Wi-Fi and Bluetooth-enabled microcontroller for IoT.",
            icon: <Microchip size={40} className="text-primary" />,
            useCase: "Wireless sensor networks and smart agriculture.",
          },
        ],
      },
      {
        category: "Prototyping",
        items: [
          {
            name: "3D Printers",
            description: "On-site printers for rapid prototyping of robot parts.",
            icon: <Printer size={40} className="text-primary" />,
            useCase: "Custom enclosures and mechanical components.",
          },
          {
            name: "PCB Fabrication",
            description: "Tools for designing and producing custom circuit boards.",
            icon: <Wrench size={40} className="text-primary" />,
            useCase: "Creating specialized electronics for robotics.",
          },
        ],
      },
      {
        category: "Sensors",
        items: [
          {
            name: "Ultrasonic Sensors",
            description: "Measure distances for obstacle avoidance in robots.",
            icon: <Thermometer size={40} className="text-primary" />,
            useCase: "Navigation in autonomous vehicles.",
          },
          {
            name: "Camera Modules",
            description: "Enable computer vision and image processing.",
            icon: <Video size={40} className="text-primary" />,
            useCase: "Object detection in waste sorting systems.",
          },
        ],
      },
      {
        category: "Power Systems",
        items: [
          {
            name: "Solar Panels",
            description: "Sustainable power for off-grid robotics projects.",
            icon: <Battery size={40} className="text-primary" />,
            useCase: "Powering water quality monitors in remote areas.",
          },
        ],
      },
      {
        category: "Advanced Platforms",
        items: [
          {
            name: "FPGA Boards",
            description: "Programmable logic for high-speed processing.",
            icon: <FPGA size={40} className="text-primary" />,
            useCase: "Real-time signal processing in medical drones.",
          },
        ],
      },
    ],
    software: [
      {
        category: "Robotics Frameworks",
        items: [
          {
            name: "Robot Operating System (ROS)",
            description: "Middleware for complex robotics projects.",
            icon: <Code2 size={40} className="text-primary" />,
            useCase: "Coordinating multi-robot systems.",
          },
          {
            name: "Gazebo",
            description: "Simulation environment for testing robotics algorithms.",
            icon: <Bot size={40} className="text-primary" />,
            useCase: "Simulating drone flight paths.",
          },
        ],
      },
      {
        category: "Computer Vision",
        items: [
          {
            name: "OpenCV",
            description: "Library for image processing and machine learning.",
            icon: <Eye size={40} className="text-primary" />,
            useCase: "Facial recognition in assistive devices.",
          },
          {
            name: "TensorFlow",
            description: "AI framework for deep learning in robotics.",
            icon: <Database size={40} className="text-primary" />,
            useCase: "Object detection in waste sorting.",
          },
        ],
      },
      {
        category: "Design Tools",
        items: [
          {
            name: "FreeCAD & Blender",
            description: "3D design and simulation tools for robotics.",
            icon: <Wrench size={40} className="text-primary" />,
            useCase: "Designing robot chassis and animations.",
          },
          {
            name: "KiCAD",
            description: "Open-source tool for PCB design.",
            icon: <Wrench size={40} className="text-primary" />,
            useCase: "Creating custom circuit boards.",
          },
        ],
      },
      {
        category: "Collaboration",
        items: [
          {
            name: "Git & GitHub",
            description: "Version control and collaboration platforms.",
            icon: <GitBranch size={40} className="text-primary" />,
            useCase: "Managing project codebases.",
          },
          {
            name: "Jupyter Notebooks",
            description: "Interactive coding for data analysis and prototyping.",
            icon: <Cloud size={40} className="text-primary" />,
            useCase: "Testing AI models for robotics.",
          },
        ],
      },
    ],
  }

  const categories = ["all", ...new Set([...tools.hardware.map(t => t.category), ...tools.software.map(t => t.category)])]

  const filteredTools = (type) =>
    tools[type]
      .flatMap(category => category.items)
      .filter(
        (tool) =>
          (activeCategory === "all" || tools[type].find(cat => cat.items.includes(tool))?.category === activeCategory) &&
          (searchTerm === "" ||
            tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )

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
              {filteredTools("hardware").map((tool, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  variants={fadeIn}
                  className="group"
                >
                  <div className="card-premium p-8 rounded-lg h-full">
                    <div className="mb-6">{tool.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 text-primary">{tool.name}</h3>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <Badge className="bg-secondary text-secondary-foreground">
                      Use Case: {tool.useCase}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="software">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTools("software").map((tool, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  variants={fadeIn}
                  className="group"
                >
                  <div className="card-premium p-8 rounded-lg h-full">
                    <div className="mb-6">{tool.icon}</div>
                    <h3 className="text-2xl font-bold mb-3 text-primary">{tool.name}</h3>
                    <p className="text-muted-foreground mb-4">{tool.description}</p>
                    <Badge className="bg-secondary text-secondary-foreground">
                      Use Case: {tool.useCase}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}