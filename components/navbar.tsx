"use client";

import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle"; // Theme Toggle button for Dark/Light mode

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Tools", href: "/tools" },
    { name: "Repositories", href: "/repositories" },
    { name: "Resources", href: "/resources" },
    { name: "Support Us", href: "/donate" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card shadow-sm py-5">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <Logo className="h-8 w-8" />
            </div>
            <span className="ml-2 text-xl font-bold text-primary">ZunoBotics</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="btn-elegant">
              <Link href="/donate">Get Involved</Link>
            </Button>
            {/* Theme Toggle Button for Desktop */}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
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

      {/* Mobile Navigation Overlay */}
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
              {/* Mobile Header */}
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

              {/* Mobile Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="py-3 text-foreground hover:text-accent font-medium text-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Footer Button */}
              <div className="p-4 border-t border-border">
                <Button
                  asChild
                  className="w-full py-6 text-lg flex items-center justify-center gap-2 btn-elegant"
                >
                  <Link href="/donate" onClick={() => setIsOpen(false)}>
                    Join Us <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}