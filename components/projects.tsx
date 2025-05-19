"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function Projects() {
  const [visibleProjects, setVisibleProjects] = useState(3)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const projects = [
    {
      title: "Autonomous Irrigation Robot",
      description:
        "A low-cost robot that automates irrigation in small farms, optimizing water usage and increasing crop yields.",
      image: "/Irrigation_Robot.png?height=300&width=400",
      tags: ["ESP32", "Ultrasonic Sensor", "DC Motor", "Solenoid Valve", "Relay Module", "3D Printing"],
      university: "Makerere University",
    },
    {
      title: "Medical Supply Delivery Drone",
      description: "A drone system designed to deliver medical supplies to remote areas with limited road access.",
      image: "/Medical_Drone.png?height=300&width=400",
      tags: ["Pixhawk 6C", "Brushless DC Motors", "GPS Module", "IMU", "ROS", "Computer Vision"],
      university: "Kyambogo University",
    },
    {
      title: "Smart Waste Sorting System",
      description: "An automated system that uses computer vision to sort recyclable waste materials.",
      image: "/Waste_Sorting.png?height=300&width=400",
      tags: ["Raspberry PI", "Gemma 3", "SunoBotics Robot Arm", "Servo Motors"],
      university: "Makerere University",
    },
    {
      title: "Solar-Powered Water Quality Monitor",
      description: "A device that continuously monitors water quality parameters in community water sources.",
      image: "/Water_Monitor.png?height=300&width=400",
      tags: ["STM32", "Sensors", "LoRs Module"],
      university: "Uganda Martyrs University",
    },
    {
      title: "Assistive Technology for Visually Impaired",
      description: "A wearable device that helps visually impaired individuals navigate their surroundings.",
      image: "/Visually_Impaired.png?height=300&width=400",
      tags: ["ESP32-CAM", "Ultrasonic Sensors", "Object Dection", "Vibration Motor", "Wearable Tech", "3D Printing"],
      university: "Mbarara University",
    },
    {
      title: "Automated Poultry Monitoring System",
      description: "A system that monitors temperature, humidity, and feed levels in poultry farms.",
      image: "/Poultry_Monitor.png?height=300&width=400",
      tags: ["STM32", "Load Cell", "DS18B20", "Sensors", "IoT"],
      university: "Kyambogo University",
    },
  ]

  const showMoreProjects = () => {
    setVisibleProjects(projects.length)
  }

  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Student Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore innovative open-source projects created by students across Uganda.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, visibleProjects).map((project, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white">{project.university}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="bg-blue-50 border-blue-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View Project Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleProjects < projects.length && (
          <div className="text-center mt-12">
            <Button
              onClick={showMoreProjects}
              variant="outline"
              className="px-8 py-6 text-lg rounded-md border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}