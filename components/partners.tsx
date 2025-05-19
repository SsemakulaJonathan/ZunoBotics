// components/partners.tsx
"use client"

import { motion } from "framer-motion"

export default function Partners() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const partners = [
    {
      name: "Makerere University",
      logo: "/images/partners/makerere.jpeg",
      category: "Academic",
      description: "Leading research institution in Uganda promoting robotics innovation.",
    },
    {
      name: "Kyambogo University",
      logo: "/images/partners/kyambogo.jpeg",
      category: "Academic",
      description: "Partner in engineering education and student-led projects.",
    },
    {
      name: "Uganda Martyrs University",
      logo: "/images/partners/uganda-martyrs.jpeg",
      category: "Academic",
      description: "Supports sustainable technology solutions for communities.",
    },
    {
      name: "Mbarara University",
      logo: "/images/partners/mbarara.jpeg",
      category: "Academic",
      description: "Drives innovation in healthcare and accessibility tech.",
    },
    {
      name: "TechBit",
      logo: "/images/partners/techbit.jpeg",
      category: "Industry",
      description: "Provides hardware components and technical expertise.",
    },
    {
      name: "Innovation Hub Uganda",
      logo: "/images/partners/innovation-hub.jpg",
      category: "Community",
      description: "Connects innovators and supports startup ecosystems.",
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div className="section-header">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
          >
            <h2>Our Partners</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We collaborate with leading universities, tech companies, and communities to empower African innovation in robotics and automation.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-center mb-4">
                <img
                  src={partner.logo || "/images/partners/techbit.jpeg"}
                  alt={partner.name}
                  className="max-h-16 grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center mb-2">{partner.name}</h3>
              <p className="text-sm text-primary text-center mb-2">{partner.category}</p>
              <p className="text-muted-foreground text-center text-sm">{partner.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
