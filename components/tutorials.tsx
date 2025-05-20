// components/tutorials.tsx
"use client"

import { motion } from "framer-motion"
import { BookOpen, Video, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Tutorials() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tutorials = [
    {
      title: "Getting Started with Arduino",
      type: "Guide",
      description: "Learn the basics of Arduino programming and hardware setup.",
      icon: <BookOpen size={40} className="text-primary" />,
      link: "#",
    },
    {
      title: "Introduction to ROS",
      type: "Video Series",
      description: "A step-by-step video guide to building robotics applications with ROS.",
      icon: <Video size={40} className="text-primary" />,
      link: "#",
    },
    {
      title: "3D Printing for Robotics",
      type: "Tutorial",
      description: "Design and print custom parts for your robotics projects.",
      icon: <FileText size={40} className="text-primary" />,
      link: "#",
    },
    {
      title: "OpenCV for Computer Vision",
      type: "Guide",
      description: "Master image processing techniques for robotics applications.",
      icon: <BookOpen size={40} className="text-primary" />,
      link: "#",
    },
  ]

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
          {tutorials.map((tutorial, index) => (
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
                <div className="mb-6">{tutorial.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-primary">{tutorial.title}</h3>
                <p className="text-muted-foreground mb-4">{tutorial.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  asChild
                >
                  <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                    View {tutorial.type}
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