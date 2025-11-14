"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div
        className={`max-w-7xl mx-auto transition-all duration-500 rounded-2xl ${
          isScrolled
            ? "backdrop-blur-2xl bg-indigo-50/80 border border-indigo-100/60 py-3 shadow-[0_8px_32px_rgba(99,102,241,0.12),0_2px_8px_rgba(99,102,241,0.08)]"
            : "backdrop-blur-xl bg-indigo-50/60 border border-indigo-100/40 py-4 shadow-[0_4px_24px_rgba(99,102,241,0.08),0_1px_4px_rgba(99,102,241,0.04)]"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center logo-3d cursor-pointer">
                <svg
                  className="w-6 h-6 text-primary-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8L10.89 13.26C11.55 13.67 12.45 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-none">
                  mailfra
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                  Email AI Platform
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <a
                href="#features"
                className="nav-link px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5"
              >
                Features
              </a>
              <a
                href="#workflow"
                className="nav-link px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5"
              >
                Workflow
              </a>
              <a
                href="#integrations"
                className="nav-link px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5"
              >
                Integrations
              </a>
              <a
                href="#pricing"
                className="nav-link px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-lg hover:bg-foreground/5"
              >
                Pricing
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" className="btn-glass btn-3d font-semibold text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="btn-3d-primary btn-3d font-semibold text-primary-foreground border-0 gap-2 group">
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  Start Free Trial
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl btn-glass btn-3d hover:scale-105 active:scale-95 transition-all"
            >
              {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-3 rounded-2xl backdrop-blur-2xl bg-card/95 border border-border/50 shadow-2xl overflow-hidden">
          <div className="p-6 space-y-1">
            <a
              href="#features"
              className="nav-link block px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-xl hover:bg-muted/50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#workflow"
              className="nav-link block px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-xl hover:bg-muted/50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Workflow
            </a>
            <a
              href="#integrations"
              className="nav-link block px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-xl hover:bg-muted/50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Integrations
            </a>
            <a
              href="#pricing"
              className="nav-link block px-4 py-3 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-xl hover:bg-muted/50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-4 space-y-2">
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full btn-glass btn-3d font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full btn-3d-primary btn-3d font-semibold border-0 gap-2">
                  <Sparkles className="w-4 h-4" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
