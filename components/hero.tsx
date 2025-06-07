"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Robot Arm Video Animation covering the entire grid
function RobotArmVideo() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-0 w-full h-full"
      // Removed animation to keep it simple, but you can add it back if needed
    >
      <video
        src="/Robot_Arm_Animation.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-80" // Full coverage with slightly increased opacity
      />
    </motion.div>
  )
}

// Grid background pattern (remains unchanged)
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
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      <RobotArmVideo />

      {/* Content - Increased z-index to ensure visibility */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-blue-800 mb-6">Invent Without Limits</h1>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mb-10 max-w-2xl mx-auto">
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

// // Robot Arm Video Animation covering over 90% of the grid
// function RobotArmVideo() {
//   return (
//     <motion.div
//       className="absolute inset-0 flex items-center justify-center z-0 w-[90vw] h-[90vh] mx-auto my-auto"
//       // Removed animation to keep it simple, but you can add it back if needed
//     >
//       <video
//         src="/Robot_Arm_Animation.mp4"
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="w-full h-full object-cover opacity-70" // Changed to object-cover and increased opacity slightly
//       />
//     </motion.div>
//   )
// }

// // Grid background pattern (remains unchanged)
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
//     <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
//       <GridBackground />
//       <RobotArmVideo />

//       {/* Content - Increased z-index to ensure visibility */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
//         <div className="max-w-3xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-white"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
//             <p className="text-xl md:text-2xl font-bold text-blue-800 mb-10 max-w-2xl mx-auto">
//               Democratizing robotics and automation innovation in Africa through open-source technology.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
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


// // // "use client"

// // // import { Button } from "@/components/ui/button"
// // // import { motion } from "framer-motion"
// // // import Image from "next/image"
// // // import robotArm3D from "@/public/robot-arm-3d.png" // Ensure transparent PNG is in public folder or adjust path

// // // Robot Arm Illustration centered and enlarged
// // function RobotArm3D() {
// //   return (
// //     <motion.div
// //       className="absolute inset-0 mx-auto my-auto w-[28rem] md:w-[36rem] lg:w-[44rem] h-auto flex items-center justify-center z-0"
// //       initial={{ rotate: 0 }}
// //       animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
// //       transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
// //     >
// //       <Image
// //         src={robotArm3D}
// //         alt="3D Robot Arm"
// //         width={704} // 44rem
// //         height={704}
// //         className="object-contain opacity-60"
// //         priority
// //       />
// //     </motion.div>
// //   )
// // }

// // // Grid background pattern
// // function GridBackground() {
// //   return (
// //     <div className="absolute inset-0 z-0 opacity-20">
// //       <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
// //         <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
// //           <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
// //         </pattern>
// //         <rect width="100%" height="100%" fill="url(#grid)" />
// //       </svg>
// //     </div>
// //   )
// // }

// // export default function Hero() {
// //   const scrollToSection = (sectionId: string) => {
// //     const section = document.getElementById(sectionId)
// //     if (section) {
// //       section.scrollIntoView({ behavior: "smooth" })
// //     }
// //   }

// //   return (
// //     <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
// //       <GridBackground />
// //       <RobotArm3D />

// //       {/* Content */}
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
// //         <div className="max-w-3xl mx-auto">
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.8 }}
// //             className="text-white"
// //           >
// //             <h1 className="text-5xl md:text-7xl font-bold mb-6">Invent Without Limits</h1>
// //             <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
// //               Democratizing robotics and automation innovation in Africa through open-source technology.
// //             </p>
// //             <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //               <Button
// //                 onClick={() => scrollToSection("projects")}
// //                 className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6 rounded-md text-white"
// //               >
// //                 Explore Projects
// //               </Button>
// //               <Button
// //                 onClick={() => scrollToSection("mission")}
// //                 className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-md text-white"
// //               >
// //                 Learn More
// //               </Button>
// //             </div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }