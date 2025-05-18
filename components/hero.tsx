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
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
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
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
      <GridBackground />
      <RobotArm3D />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Democratizing robotics and automation innovation in Africa through open-source technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
  )
}



// "use client"

// import { Button } from "@/components/ui/button"
// import { motion } from "framer-motion"

// // Simple robot illustration similar to the reference
// function RobotIllustration() {
//   return (
//     <div className="absolute bottom-0 right-0 md:right-10 lg:right-20 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
//       <motion.svg
//         viewBox="0 0 240 240"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <circle cx="120" cy="120" r="80" fill="#3b82f6" opacity="0.3" />
//         <motion.g
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.5, duration: 0.8 }}
//         >
//           {/* Robot head */}
//           <rect x="80" y="60" width="80" height="80" rx="10" fill="white" />
//           {/* Robot eyes */}
//           <rect x="95" y="85" width="15" height="5" rx="2.5" fill="#3b82f6" />
//           <rect x="130" y="85" width="15" height="5" rx="2.5" fill="#3b82f6" />
//           {/* Robot mouth */}
//           <rect x="105" y="105" width="30" height="5" rx="2.5" fill="#3b82f6" />
//           {/* Robot body */}
//           <rect x="105" y="140" width="30" height="40" rx="5" fill="white" />
//           {/* Robot legs */}
//           <rect x="105" y="180" width="10" height="20" rx="5" fill="white" />
//           <rect x="125" y="180" width="10" height="20" rx="5" fill="white" />
//           {/* Robot arms */}
//           <rect x="65" y="150" width="40" height="8" rx="4" fill="white" />
//           <rect x="135" y="150" width="40" height="8" rx="4" fill="white" />
//           {/* Robot antenna */}
//           <rect x="115" y="50" width="10" height="10" rx="5" fill="white" />
//           <line x1="120" y1="40" x2="120" y2="50" stroke="white" strokeWidth="2" />
//         </motion.g>
//       </motion.svg>
//     </div>
//   )
// }

// // Grid background pattern
// function GridBackground() {
//   return (
//     <div className="absolute inset-0 z-0 opacity-20">
//       <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//         <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
//           <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
//         </pattern>
//         <rect width="100%" height="100%" fill="url(#grid)" />
//       </svg>
//     </div>
//   )
// }

// export default function Hero() {
//   const scrollToSection = (sectionId: string) => {
//     const section = document.getElementById(sectionId)
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth" })
//     }
//   }

//   return (
//     <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
//       <GridBackground />
//       <RobotIllustration />

//       {/* Content */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="max-w-3xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-white"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
//             <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl">
//               Democratizing robotics and automation innovation in Africa through open-source technology.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={() => scrollToSection("projects")}
//                 className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6 rounded-md text-white"
//               >
//                 Explore Projects
//               </Button>
//               <Button
//                 onClick={() => scrollToSection("mission")}
//                 className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-md text-white"
//               >
//                 Learn More
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }