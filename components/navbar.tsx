// components/navbar.tsx
"use client"

import { useState } from "react"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Tools", href: "#tools" },
    { name: "Repositories", href: "#repositories" },
    { name: "Support Us", href: "#support" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      const offset = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: offset, behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card shadow-sm py-5"
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
                <Logo className="h-8 w-8" />
              </div>
              <span className="ml-2 text-xl font-bold text-primary">ZunoBotics</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-medium text-foreground hover:text-accent transition-colors"
                onClick={(e) => handleScroll(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <ThemeToggle />
            <Button asChild className="btn-elegant">
              <Link href="/support">Get Involved</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              type="button"
              className="text-primary hover:text-accent"
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
            className="fixed inset-0 bg-card z-40 md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link href="/" className="flex items-center">
                  <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
                    <Logo className="h-8 w-8" />
                  </div>
                  <span className="ml-2 text-xl font-bold text-foreground">ZunoBotics</span>
                </Link>
                <button
                  type="button"
                  className="text-foreground hover:text-accent"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      className={`py-3 text-foreground hover:text-accent font-medium text-xl ${
                        item.name === "Support Us" ? "bg-secondary px-4 py-4 rounded-md" : ""
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4">
                    <ThemeToggle />
                  </div>
                </nav>
              </div>

              <div className="p-4 border-t border-border">
                <Button
                  asChild
                  className="w-full py-6 text-lg flex items-center justify-center gap-2 btn-elegant"
                >
                  <Link href="/support" onClick={() => setIsOpen(false)}>
                    Join Us <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}