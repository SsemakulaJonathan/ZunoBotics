// components/hero.tsx
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Image from "next/image"
import robotArm3D from "./robot-arm-3d.png" // Ensure transparent PNG is in public folder or adjust path

// Robot Arm Illustration centered and enlarged
function RobotArm3D() {
  return (
    <motion.div
      className="absolute inset-0 mx-auto my-auto w-[28rem] md:w-[36rem] lg:w-[44rem] h-auto flex items-center justify-center z-0"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    >
      <Image
        src={robotArm3D}
        alt="3D Robot Arm"
        width={704} // 44rem
        height={704}
        className="object-contain opacity-60"
        priority
      />
    </motion.div>
  )
}

// Grid background pattern
function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
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
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-section">
      <GridBackground />
      <RobotArm3D />

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-foreground"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
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
                className="btn-elegant text-lg px-8 py-6"
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