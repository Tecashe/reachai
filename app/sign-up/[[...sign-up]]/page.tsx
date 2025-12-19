
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { dark } from "@clerk/themes"
import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

const headlines = [
  { main: "Send emails that convert", sub: "AI-powered personalization at scale" },
  { main: "Book more meetings", sub: "Turn cold leads into warm conversations" },
  { main: "Scale your outreach", sub: "Reach thousands without losing the personal touch" },
  { main: "Close deals faster", sub: "Smart sequences that work while you sleep" },
]

export default function SignUpPage() {
  const [headlineIndex, setHeadlineIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0a0a0a]">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left bento card - Dark monochrome with Text Morph */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-[#0a0a0a] relative overflow-hidden rounded-3xl border border-white/10">
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid-signup" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-signup)" />
            </svg>
          </div>

          {/* Monochrome gradient blur - subtle gray tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 blur-3xl" />

          {/* Morphing Text */}
          <div className="relative z-10 px-12 max-w-lg text-center h-40 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={headlineIndex}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute"
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 text-balance">
                  {headlines[headlineIndex].main}
                </h1>
                <p className="text-xl text-white/50">{headlines[headlineIndex].sub}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-12 left-12 right-12">
            <div className="flex gap-3">
              {headlines.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{
                      width: i === headlineIndex ? "100%" : i < headlineIndex ? "100%" : "0%",
                    }}
                    transition={{ duration: i === headlineIndex ? 3.5 : 0, ease: "linear" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-12 bg-[#18181b] relative rounded-3xl border border-white/10 shadow-lg overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid-pattern-right" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-right)" />
            </svg>
          </div>

          {/* Animated corner brackets */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/20"
            initial={{ opacity: 0, x: -10, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/20"
            initial={{ opacity: 0, x: 10, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/20"
            initial={{ opacity: 0, x: -10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/20"
            initial={{ opacity: 0, x: 10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="lg:hidden text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to home</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SignUp
                appearance={{
                  baseTheme: dark,
                  elements: {
                    rootBox: "w-full",
                    card: "bg-[#18181b] shadow-none",
                    headerTitle: "text-white",
                    headerSubtitle: "text-white/50",
                    socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                    formFieldLabel: "text-white/70",
                    formFieldInput: "bg-white/5 border-white/10 text-white",
                    formButtonPrimary: "bg-white text-black hover:bg-white/90",
                    footerActionLink: "text-white hover:text-white/70",
                  },
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
