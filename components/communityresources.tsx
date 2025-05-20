// components/community-resources.tsx
"use client"

import { motion } from "framer-motion"
import { Users, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommunityResources() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const resources = [
    {
      title: "ZunoBotics Slack Community",
      description: "Join our Slack channel to connect with students, mentors, and innovators.",
      icon: <MessageSquare size={40} className="text-primary" />,
      link: "#",
    },
    {
      title: "Monthly Robotics Meetups",
      description: "Attend our virtual and in-person meetups to network and share ideas.",
      icon: <Calendar size={40} className="text-primary" />,
      link: "#",
    },
    {
      title: "Mentor Network",
      description: "Access our network of experienced mentors for project guidance.",
      icon: <Users size={40} className="text-primary" />,
      link: "#",
    },
  ]

  return (
    <section id="community" className="py-24 bg-background" aria-labelledby="community-heading">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 id="community-heading" className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Community Resources
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Engage with our vibrant community to collaborate, learn, and grow as an innovator.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
              className="group"
            >
              <div className="bg-card p-8 rounded-lg shadow-md h-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <div className="mb-6">{resource.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-primary">{resource.title}</h3>
                <p className="text-muted-foreground mb-4">{resource.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  asChild
                >
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    Join Now
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