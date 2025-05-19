// components/mission.tsx
"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, Award } from 'lucide-react'
import { Badge } from "@/components/ui/badge"; 

export default function Mission() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const teamMembers = [
    {
      name: "Jonathan Ssemakula",
      role: "Founder & Director",
      image: "/images/team/jon.jpg",
      description: "Masters in Robotics & Mechatronics Engineering leading ZunoBotics' mission to empower African innovators.",
    },
    {
      name: "Isaac Ssozi",
      role: "Lead Student Engineer",
      image: "/images/team/isaac.png",
      description: "Computer Scientist from Makerere University spearheading irrigation projects.",
    },
    {
      name: "Farouk Jjingo",
      role: "Community Manager",
      image: "/images/team/farouk.png",
      description: "Coordinates student collaborations and community outreach programs.",
    },
  ]

  const milestones = [
    {
      year: "2023",
      title: "ZunoBotics Founded",
      description: "Initiated at Makerere University to democratize robotics in Africa.",
      icon: <Briefcase size={24} className="text-primary" />,
    },
    {
      year: "2024",
      title: "First Prototype",
      description: "Developed the Autonomous Irrigation Robot, impacting local farmers.",
      icon: <Award size={24} className="text-primary" />,
    },
    {
      year: "2025",
      title: "Official Launch",
      description: "Launching across Uganda with partnerships at 5 universities.",
      icon: <Users size={24} className="text-primary" />,
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Mission Section */}
      <section id="mission" className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-muted text-muted-foreground">Our Vision</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Vision & Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ZunoBotics is a robotics and automation open-source innovation hub launching in Uganda in 2025. Our vision
              is to democratize innovation by making robotics and automation technology accessible to students and young
              innovators across Africa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              variants={fadeIn}
              className="bg-card p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Democratize Innovation</h3>
              <p className="text-muted-foreground">
                Making robotics and automation technology accessible to students and young innovators across Africa,
                breaking down financial and technical barriers.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeIn}
              className="bg-card p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Build Community</h3>
              <p className="text-muted-foreground">
                Creating a growing ecosystem of shared knowledge and accessible innovation in Africa, where students
                collaborate and learn from each other.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={fadeIn}
              className="bg-card p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-primary">Open Source Everything</h3>
              <p className="text-muted-foreground">
                All projects are open-sourced, allowing anyone to learn from and build upon previous work, creating a
                repository of African-made robotics solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the passionate individuals driving ZunoBotics' mission to empower African innovators.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-card p-6 rounded-lg shadow-md border border-border"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
 радумийл className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From our founding to our upcoming launch, here are key milestones in ZunoBotics' story.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeIn}
                className="bg-card p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  {milestone.icon}
                  <h3 className="text-xl font-bold text-foreground ml-3">{milestone.year}</h3>
                </div>
                <h4 className="text-lg font-semibold text-primary mb-2">{milestone.title}</h4>
                <p className="text-muted-foreground">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}