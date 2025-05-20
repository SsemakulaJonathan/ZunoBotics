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
    <section id="repositories" className="py-24 bg-background" aria-labelledby="repositories-heading">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 id="repositories-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Open-Source Repositories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
              <div className="card-premium p-8 rounded-lg h-full transition-transform duration-300 group-hover:scale-105">
                <div className="flex items-center mb-4">
                  <Github size={24} className="text-primary mr-2" />
                  <h3 className="text-xl font-bold text-foreground">{repo.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{repo.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork size={16} className="text-muted-foreground mr-1" />
                    <span>{repo.forks}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
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