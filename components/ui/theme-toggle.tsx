// "use client"

// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// export function ThemeToggle() {
//   const { setTheme, theme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted/50 transition-all duration-200">
//           <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           <Sun className="mr-2 h-4 w-4" />
//           <span>Light</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           <Moon className="mr-2 h-4 w-4" />
//           <span>Dark</span>
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           <span className="mr-2">💻</span>
//           <span>System</span>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(theme === "dark")
  }, [theme])

  if (!mounted) return null

  const handleToggle = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={handleToggle}
      className={`relative px-4 py-2 rounded-full text-sm transition-all duration-500 overflow-hidden border-2
        ${isDark
          ? 'bg-primary border-primary/50 text-primary-foreground shadow-lg shadow-primary/20'
          : 'bg-secondary border-secondary/50 text-secondary-foreground shadow-lg shadow-secondary/30'
        }
      `}
      aria-label="Toggle theme"
    >
      {/* Background shine effect */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${isDark ? 'bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent' : 'bg-gradient-to-r from-transparent via-secondary-foreground/10 to-transparent'
          }`}
      />

      {/* Content wrapper */}
      <div className="relative flex items-center gap-1.5 justify-center">
        <span className={`transition-all duration-300 ${isDark ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <Moon className="w-3.5 h-3.5" />
        </span>
        {/* <span className="font-medium">{isDark ? 'Dark' : 'Light'}</span> */}
        <span className={`transition-all duration-300 ${isDark ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          <Sun className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  )
}
