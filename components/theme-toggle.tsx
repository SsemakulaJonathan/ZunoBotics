// components/theme-toggle.tsx
"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userOverride, setUserOverride] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Check if user has manually overridden the theme
    const hasUserOverride = localStorage.getItem('theme-user-override')
    if (hasUserOverride) {
      setUserOverride(true)
    }
  }, [])

  if (!mounted) {
    return null // Prevent rendering until mounted
  }

  const toggleTheme = () => {
    // Mark that user has manually changed theme
    localStorage.setItem('theme-user-override', 'true')
    setUserOverride(true)
    
    if (theme === "system") {
      // If currently on system, switch to opposite of current system theme
      setTheme(systemTheme === "dark" ? "light" : "dark")
    } else {
      // Toggle between light and dark
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  const resetToSystem = () => {
    localStorage.removeItem('theme-user-override')
    setUserOverride(false)
    setTheme("system")
  }

  const getDisplayIcon = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
    }
    return theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
  }

  const getAriaLabel = () => {
    if (theme === "system") {
      return `Switch to ${systemTheme === "dark" ? "light" : "dark"} mode`
    }
    return `Switch to ${theme === "light" ? "dark" : "light"} mode`
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={getAriaLabel()}
        className="btn-elegant"
        title={theme === "system" ? `Auto (${systemTheme})` : theme}
      >
        {getDisplayIcon()}
      </Button>
      
      {userOverride && (
        <Button
          variant="ghost"
          size="icon"
          onClick={resetToSystem}
          aria-label="Reset to system theme"
          className="btn-elegant opacity-60 hover:opacity-100"
          title="Reset to auto"
        >
          <Monitor className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}