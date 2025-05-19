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
      icon: <MessageSquare size={40} className="text-blue-600" />,
      link: "#",
    },
    {
      title: "Monthly Robotics Meetups",
      description: "Attend our virtual and in-person meetups to network and share ideas.",
      icon: <Calendar size={40} className="text-blue-600" />,
      link: "#",
    },
    {
      title: "Mentor Network",
      description: "Access our network of experienced mentors for project guidance.",
      icon: <Users size={40} className="text-blue-600" />,
      link: "#",
    },
  ]

  return (
    <section id="community" className="py-24 bg-gray-50" aria-labelledby="community-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 id="community-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Community Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <div className="bg-white p-8 rounded-lg shadow-md h-full transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <div className="mb-6">{resource.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
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