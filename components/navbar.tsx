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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle navbar background change
      setScrolled(currentScrollY > 10);
      
      // Handle navbar visibility
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else {
        setIsVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  const handleNavClick = (href: string, isExternal: boolean) => {
    setIsOpen(false);
    if (!isExternal) {
      router.push(href);
    }
  };

  return (
    <>
      <div className="h-safe-area w-full bg-card fixed top-0 left-0 right-0 z-40" />
      
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-safe-area left-0 right-0 h-16 z-50 bg-card border-b border-border transition-shadow duration-300 transform`}
      >
        <div className="container h-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center h-full">
              <Logo width={32} height={32} className="mr-2" />
              <span className="text-lg font-bold text-foreground">
                ZunoBotics
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className={`font-medium transition-colors hover:text-accent ${
                    pathname === item.href && !item.isExternal
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Button asChild className="btn-elegant">
                <Link href="/about#get-involved">
                  Get Involved
                </Link>
              </Button>
              <ThemeToggle />
            </nav>

            <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="text-foreground hover:text-accent"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4rem)] bottom-0 bg-card border-t border-border z-40 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <nav className="flex flex-col p-4 gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        target={item.isExternal ? "_blank" : undefined}
                        rel={item.isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => handleNavClick(item.href, item.isExternal)}
                        className={`py-3 px-4 rounded-md font-medium text-lg transition-colors ${
                          pathname === item.href && !item.isExternal
                            ? "text-accent bg-accent/10"
                            : "text-foreground hover:text-accent hover:bg-accent/5"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="p-4 border-t border-border">
                  <Button
                    asChild
                    className="w-full py-6 text-lg flex items-center justify-center gap-2 btn-elegant"
                  >
                    <Link 
                      href="/about#get-involved"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Involved <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}