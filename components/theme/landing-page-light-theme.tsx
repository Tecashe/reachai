"use client"

import { useEffect } from "react"

export function ForceLightTheme() {
  useEffect(() => {
    const html = document.documentElement

    // Remove dark class if it exists
    html.classList.remove("dark")
    html.classList.add("light")

    // Override any theme preference in localStorage for this page only
    const originalTheme = localStorage.getItem("theme")
    localStorage.setItem("theme", "light")

    // Create a MutationObserver to prevent any theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          if (html.classList.contains("dark")) {
            html.classList.remove("dark")
            html.classList.add("light")
          }
        }
      })
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Cleanup on unmount - restore original theme if it existed
    return () => {
      observer.disconnect()
      if (originalTheme) {
        localStorage.setItem("theme", originalTheme)
      }
    }
  }, [])

  return null
}
