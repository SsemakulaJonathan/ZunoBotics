"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

function RobotArmVideo() {
  return (
    <>
      {/* Video background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <video
          src="/Robot_Arm_Animation.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        />
      </motion.div>
      {/* Subtle overlay using the theme colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-background/20 to-accent/30 z-10" />
    </>
  )
}

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-background via-primary/10 to-accent/10"
      aria-labelledby="hero-heading"
    >
      <RobotArmVideo />
      <div className="container relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              id="hero-heading"
              className="text-5xl md:text-7xl text-balance mb-6"
            >
              Invent Without Limits
            </h1>
            <p className="text-xl md:text-2xl text-secondary-foreground mb-10 max-w-2xl mx-auto">
              Democratizing robotics and automation innovation in Africa through open-source technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection("projects")}
                className="btn-elegant text-lg px-8 py-6"
              >
                Explore Projects
              </Button>
              <Button
                onClick={() => scrollToSection("mission")}
                variant="secondary"
                className="text-lg px-8 py-6 hover:scale-[1.06] transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}