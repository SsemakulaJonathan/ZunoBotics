// components/repositories.tsx
"use client"

import { motion } from "framer-motion"
import { Github, Star, GitFork } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Repositories() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const repos = [
    {
      name: "ZunoBotics Core Toolkit",
      description: "Core libraries and firmware for ZunoBotics robotics projects.",
      stars: 120,
      forks: 45,
      link: "#",
    },
    {
      name: "Autonomous Irrigation Robot",
      description: "Codebase for the irrigation robot project.",
      stars: 80,
      forks: 30,
      link: "#",
    },
    {
      name: "ROS Integration Module",
      description: "Tools for integrating ZunoBotics hardware with ROS.",
      stars: 60,
      forks: 20,
      link: "#",
    },
  ]

  return (
    <section id="repositories" className="py-24 bg-white" aria-labelledby="repositories-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 id="repositories-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Open-Source Repositories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our open-source repositories, freely available for learning and collaboration.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
              className="group"
            >
              <div className="bg-gray-50 p-8 rounded-lg shadow-md h-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <Github size={24} className="text-blue-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">{repo.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{repo.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork size={16} className="text-gray-500 mr-1" />
                    <span>{repo.forks}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href={repo.link} target="_blank" rel="noopener noreferrer">
                    View Repository
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}