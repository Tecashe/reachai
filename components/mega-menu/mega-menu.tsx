"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuItemContent {
  icon: React.ReactNode
  title: string
  description?: string
  href: string
}

interface MenuSection {
  title: string
  items: MenuItemContent[]
  preview?: {
    title: string
    description: string
    image?: string
    cta?: {
      label: string
      href: string
    }
  }
}

interface MegaMenuProps {
  label: string
  sections: MenuSection[]
}

export function MegaMenu({ label, sections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setHoveredItem(null)
    }, 150)
  }

 const handleMouseEnter = () => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
    }

  const previewContent = hoveredItem
    ? sections
        .flatMap((section) => section.items)
        .find((item) => item.title === hoveredItem)
    : sections[0]?.items[0]

  return (
    <div ref={containerRef} className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group/button flex items-center gap-2"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover/button:w-8 transition-all duration-300 -translate-x-1/2" />
      </button>

      {/* Megamenu Panel */}
      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-0 top-full pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 hidden lg:block"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden min-w-[900px]">
            {/* Content Grid */}
            <div className="grid grid-cols-3 gap-0">
              {/* Left Column - Menu Items */}
              <div className="col-span-1 border-r border-border/30 py-6 px-6 max-h-[500px] overflow-y-auto">
                <div className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.title} className="mb-6">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.title)}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group/item ${
                              hoveredItem === item.title
                                ? "bg-primary/10 text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                          >
                            <div className="mt-0.5 text-primary group-hover/item:scale-110 transition-transform duration-300">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium leading-tight">
                                {item.title}
                              </div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="col-span-2 py-8 px-8 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "0.5s" }} />

                {sections.map((section) => (
                  <div key={section.title}>
                    {section.items.map((item) => (
                      hoveredItem === item.title && section.preview && (
                        <div
                          key={item.title}
                          className="animate-in fade-in duration-300"
                        >
                          <div className="mb-4">
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                              {section.preview.title}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                              {section.preview.description}
                            </p>
                          </div>

                          {section.preview.image && (
                            <div className="mt-6 mb-6 rounded-xl overflow-hidden bg-muted/50 h-48 flex items-center justify-center text-muted-foreground text-sm">
                              {/* Image would go here */}
                              Featured Content
                            </div>
                          )}

                          {section.preview.cta && (
                            <Button
                              asChild
                              className="group/cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                            >
                              <Link href={section.preview.cta.href}>
                                {section.preview.cta.label}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
