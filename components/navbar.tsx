"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", isExternal: false },
    { name: "About", href: "/about", isExternal: false },
    { name: "Projects", href: "/projects", isExternal: false },
    { name: "Services", href: "https://services.zunobotics.com", isExternal: true },
    { name: "Tools", href: "/tools", isExternal: false },
    { name: "Repositories", href: "/repositories", isExternal: false },
    { name: "Resources", href: "/resources", isExternal: false },
    { name: "Support Us", href: "/donate", isExternal: false },
  ];

  // Close mobile menu after navigation
  const handleNavClick = (href: string, isExternal: boolean) => {
    setIsOpen(false);
    if (!isExternal) {
      router.push(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card shadow-sm ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
              <Logo className="h-8 w-8" />
            </div>
            <span
              className={`ml-2 text-xl font-bold ${scrolled ? "text-foreground" : "text-primary"}`}
            >
              ZunoBotics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className={`font-medium transition-colors ${
                  pathname === item.href && !item.isExternal
                    ? "text-accent"
                    : scrolled
                      ? "text-foreground hover:text-accent"
                      : "text-foreground hover:text-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="btn-elegant">
              <Link href="/donate">Get Involved</Link>
            </Button>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className={scrolled ? "text-foreground hover:text-accent" : "text-primary hover:text-accent"}
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
                    <Logo className="text-accent h-24 w-12" />
                  </div>
                <span className="ml-2 text-xl font-semibold text-foreground">About</span>
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
                      target={item.isExternal ? "_blank" : undefined}
                      rel={item.isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => handleNavClick(item.href, item.isExternal)}
                      className={`py-3 font-medium text-xl ${
                        pathname === item.href && !item.isExternal
                          ? "text-accent"
                          : "text-foreground hover:text-accent"
                        } ${item.name === "Support Us" ? "bg-accent/10 px-4 py-4 rounded" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Footer Button and */}
              <div>
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
          ))}
      </motion.div>
    </div>
  </header>
);