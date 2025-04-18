"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import robotAnimation from "./robot.json"; // If in src/animations/
import { useEffect, useRef } from "react";

// Robot illustration using Lottie animation
function RobotIllustration() {
  const lottieRef = useRef(null);

  // Control Lottie animation playback
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    return () => {
      if (lottieRef.current) {
        lottieRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="absolute bottom-0 right-0 md:right-10 lg:right-20 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={robotAnimation}
          loop={true} // Set to false for single play
          autoplay={false} // Controlled via useEffect
          style={{ width: "100%", height: "100%" }}
          aria-label="Animated robot illustration"
        />
      </motion.div>
    </div>
  );
}

// Grid background pattern
function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
      <GridBackground />
      <RobotIllustration />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">
              Democratizing robotics and automation innovation in Africa through open-source technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection("projects")}
                className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6 rounded-md text-white"
              >
                Explore Projects
              </Button>
              <Button
                onClick={() => scrollToSection("mission")}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-md text-white"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}