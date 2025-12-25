// components/guides/ProgressBar.tsx
// Reading progress indicator

'use client'

import { useEffect, useState } from 'react'

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const trackLength = documentHeight - windowHeight
      
      const scrollProgress = Math.min((scrollTop / trackLength) * 100, 100)
      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 transition-all duration-150"
      style={{ width: `${progress}%` }}
      aria-label={`Reading progress: ${Math.round(progress)}%`}
    />
  )
}