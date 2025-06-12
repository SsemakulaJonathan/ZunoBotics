import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function RobotArmVideo() {
  return (
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
        className="w-full h-full object-cover"
      />
      {/* Removed dark overlay and opacity adjustment */}
    </motion.div>
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
    <section
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
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
              className="text-5xl md:text-7xl font-bold text-foreground mb-6 drop-shadow-lg"
            >
              Invent Without Limits
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto drop-shadow-lg">
              Democratizing robotics and automation innovation in Africa through open-source technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => scrollToSection("projects")}
                className="btn-elegant text-lg px-8 py-6 rounded-md"
              >
                Explore Projects
              </Button>
              <Button
                onClick={() => scrollToSection("mission")}
                className="btn-elegant text-lg px-8 py-6 rounded-md"
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
