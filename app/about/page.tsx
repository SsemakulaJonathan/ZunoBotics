// app/about/page.tsx
"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Briefcase, Award } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Logo from '@/components/logo'

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Team data (sample, replace with actual data)
  const teamMembers = [
    {
      name: "Dr. Jane Nsubuga",
      role: "Founder & Director",
      image: "/api/placeholder/150/150",
      description: "PhD in Robotics, leading ZunoBotics' mission to empower African innovators.",
    },
    {
      name: "Ibrahim Mulonda",
      role: "Lead Student Engineer",
      image: "/api/placeholder/150/150",
      description: "Engineering student at Makerere University, spearheading irrigation projects.",
    },
    {
      name: "Sarah Kiguli",
      role: "Community Manager",
      image: "/api/placeholder/150/150",
      description: "Coordinates student collaborations and community outreach programs.",
    },
  ]

  // Milestones data (sample, replace with actual data)
  const milestones = [
    {
      year: "2023",
      title: "ZunoBotics Founded",
      description: "Initiated at Makerere University to democratize robotics in Africa.",
      icon: <Briefcase size={24} className="text-blue-600" />,
    },
    {
      year: "2024",
      title: "First Prototype",
      description: "Developed the Autonomous Irrigation Robot, impacting local farmers.",
      icon: <Award size={24} className="text-blue-600" />,
    },
    {
      year: "2025",
      title: "Official Launch",
      description: "Launching across Uganda with partnerships at 5 universities.",
      icon: <Users size={24} className="text-blue-600" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Mission Section (Adapted from Mission Component) */}
      <section id="mission" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 text-blue-600 font-medium text-sm">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Vision & Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              className="bg-gray-50 p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Democratize Innovation</h3>
              <p className="text-gray-600">
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
              className="bg-gray-50 p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Build Community</h3>
              <p className="text-gray-600">
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
              className="bg-gray-50 p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Open Source Everything</h3>
              <p className="text-gray-600">
                All projects are open-sourced, allowing anyone to learn from and build upon previous work, creating a
                repository of African-made robotics solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  {milestone.icon}
                  <h3 className="text-xl font-bold text-gray-800 ml-3">{milestone.year}</h3>
                </div>
                <h4 className="text-lg font-semibold text-blue-600 mb-2">{milestone.title}</h4>
                <p className="text-gray-600">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Be part of ZunoBotics by contributing as a student, mentor, or supporter. Help us build a future where
              African innovation thrives.
            </p>
            <Button
              asChild
              className="bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition flex items-center justify-center mx-auto"
            >
              <Link href="/support">
                Get Involved
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                  <Logo className="h-8 w-8" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">ZunoBotics</span>
              </Link>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-gray-600">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <Link href="/about" className="hover:text-blue-600">About</Link>
              <Link href="/impact" className="hover:text-blue-600">Impact</Link>
              <Link href="/projects" className="hover:text-blue-600">Projects</Link>
              <Link href="/resources" className="hover:text-blue-600">Resources</Link>
              <Link href="/support" className="hover:text-blue-600">Support Us</Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ZunoBotics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}