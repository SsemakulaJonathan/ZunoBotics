"use client"

import { useState, useEffect } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Determine active section
      const sections = ["mission", "timeline", "tools", "projects", "support"]
      let currentSection = ""

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section
            break
          }
        }
      }

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const navItems = [
    { name: "Home", href: "#", id: "" },
    { name: "About", href: "#mission", id: "mission" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Resources", href: "#tools", id: "tools" },
    { name: "Support Us", href: "#support", id: "support" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm py-3" : "bg-white py-5" //changed header colour to white
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => scrollToSection("")} className="flex items-center">
              <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                <Logo className="h-8 w-8" />
              </div>
              <span className={`ml-2 text-xl font-bold ${scrolled ? "text-gray-700" : "text-blue-600"}`}>ZunoBotics</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors ${
                  scrolled
                    ? activeSection === item.id
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                    : activeSection === item.id
                      ? "text-gray-700"
                      : "text-gray-700 hover:text-gray-700"
                }`}
              >
                {item.name}
              </button>
            ))}
            <Button onClick={() => scrollToSection("support")} className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Involved
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={scrolled ? "text-gray-700 hover:text-blue-600" : "text-blue-600"}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-40 md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <div className="bg-blue-600 rounded-lg p-2 flex items-center justify-center">
                    <Logo className="h-8 w-8" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">ZunoBotics</span>
                </div>
                <button
                  type="button"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.id)}
                      className={`py-3 text-gray-700 hover:text-blue-600 font-medium text-xl ${
                        item.name === "Support Us" ? "bg-blue-50 px-4 py-4 rounded-md" : ""
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t">
                <Button
                  onClick={() => scrollToSection("support")}
                  className="w-full py-6 text-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Join Us <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}