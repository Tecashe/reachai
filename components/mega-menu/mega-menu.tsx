// "use client"

// import React from "react"

// import { useState, useRef, useEffect } from "react"
// import Link from "next/link"
// import { ChevronDown, ArrowRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface MenuItemContent {
//   icon: React.ReactNode
//   title: string
//   description?: string
//   href: string
// }

// interface MenuSection {
//   title: string
//   items: MenuItemContent[]
//   preview?: {
//     title: string
//     description: string
//     image?: string
//     cta?: {
//       label: string
//       href: string
//     }
//   }
// }

// interface MegaMenuProps {
//   label: string
//   sections: MenuSection[]
// }

// export function MegaMenu({ label, sections }: MegaMenuProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   const handleMouseLeave = () => {
//     timeoutRef.current = setTimeout(() => {
//       setIsOpen(false)
//       setHoveredItem(null)
//     }, 150)
//   }

//  const handleMouseEnter = () => {
//     if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//     }
//     setIsOpen(true)
//     }

//   const previewContent = hoveredItem
//     ? sections
//         .flatMap((section) => section.items)
//         .find((item) => item.title === hoveredItem)
//     : sections[0]?.items[0]

//   return (
//     <div ref={containerRef} className="relative group">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group/button flex items-center gap-2"
//       >
//         {label}
//         <ChevronDown
//           className={`w-4 h-4 transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//         <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover/button:w-8 transition-all duration-300 -translate-x-1/2" />
//       </button>

//       {/* Megamenu Panel */}
//       {isOpen && (
//         <div
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           className="absolute left-0 top-full pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 hidden lg:block"
//         >
//           <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden min-w-[900px]">
//             {/* Content Grid */}
//             <div className="grid grid-cols-3 gap-0">
//               {/* Left Column - Menu Items */}
//               <div className="col-span-1 border-r border-border/30 py-6 px-6 max-h-[500px] overflow-y-auto">
//                 <div className="space-y-1">
//                   {sections.map((section) => (
//                     <div key={section.title} className="mb-6">
//                       <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
//                         {section.title}
//                       </h3>
//                       <div className="space-y-1">
//                         {section.items.map((item) => (
//                           <Link
//                             key={item.title}
//                             href={item.href}
//                             onMouseEnter={() => setHoveredItem(item.title)}
//                             onClick={() => setIsOpen(false)}
//                             className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group/item ${
//                               hoveredItem === item.title
//                                 ? "bg-primary/10 text-foreground"
//                                 : "text-muted-foreground hover:text-foreground hover:bg-background/50"
//                             }`}
//                           >
//                             <div className="mt-0.5 text-primary group-hover/item:scale-110 transition-transform duration-300">
//                               {item.icon}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="text-sm font-medium leading-tight">
//                                 {item.title}
//                               </div>
//                               {item.description && (
//                                 <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
//                                   {item.description}
//                                 </div>
//                               )}
//                             </div>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Right Column - Preview */}
//               <div className="col-span-2 py-8 px-8 bg-gradient-to-br from-primary/5 via-background to-background relative overflow-hidden">
//                 {/* Animated background elements */}
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
//                 <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "0.5s" }} />

//                 {sections.map((section) => (
//                   <div key={section.title}>
//                     {section.items.map((item) => (
//                       hoveredItem === item.title && section.preview && (
//                         <div
//                           key={item.title}
//                           className="animate-in fade-in duration-300"
//                         >
//                           <div className="mb-4">
//                             <h2 className="text-2xl font-bold text-foreground mb-2">
//                               {section.preview.title}
//                             </h2>
//                             <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
//                               {section.preview.description}
//                             </p>
//                           </div>

//                           {section.preview.image && (
//                             <div className="mt-6 mb-6 rounded-xl overflow-hidden bg-muted/50 h-48 flex items-center justify-center text-muted-foreground text-sm">
//                               {/* Image would go here */}
//                               Featured Content
//                             </div>
//                           )}

//                           {section.preview.cta && (
//                             <Button
//                               asChild
//                               className="group/cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
//                             >
//                               <Link href={section.preview.cta.href}>
//                                 {section.preview.cta.label}
//                                 <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
//                               </Link>
//                             </Button>
//                           )}
//                         </div>
//                       )
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }












// "use client"

// import React from "react"
// import { useState, useRef, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { ChevronDown, ArrowRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// interface MenuItemContent {
//   icon: React.ReactNode
//   title: string
//   description?: string
//   href: string
// }

// interface MenuSection {
//   title: string
//   items: MenuItemContent[]
//   preview?: {
//     title: string
//     description: string
//     image?: string
//     cta?: {
//       label: string
//       href: string
//     }
//   }
// }

// interface MegaMenuProps {
//   label: string
//   sections: MenuSection[]
// }

// // Map menu labels to default preview images
// const defaultPreviewImages: Record<string, string> = {
//   Platform: "/megamenu-platform.jpg",
//   Solutions: "/megamenu-solutions.jpg",
//   Developers: "/megamenu-developers.jpg",
//   Company: "/megamenu-company.jpg",
// }

// export function MegaMenu({ label, sections }: MegaMenuProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null)
//   const [isMobile, setIsMobile] = useState(false)
//   const containerRef = useRef<HTMLDivElement>(null)
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setIsOpen(false)
//       }
//     }

//     // Detect mobile/touch device
//     const detectMobile = () => {
//       setIsMobile(window.innerWidth < 1024)
//     }
//     detectMobile()
//     window.addEventListener("resize", detectMobile)

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//       window.removeEventListener("resize", detectMobile)
//     }
//   }, [])

//   const handleMouseLeave = () => {
//     timeoutRef.current = setTimeout(() => {
//       setIsOpen(false)
//       setHoveredItem(null)
//     }, 150)
//   }

//   const handleMouseEnter = () => {
//     if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//     }
//     setIsOpen(true)
//     }


//   const previewContent = hoveredItem
//     ? sections
//         .flatMap((section) => section.items)
//         .find((item) => item.title === hoveredItem)
//     : sections[0]?.items[0]

//   const getPreviewImage = () => {
//     return defaultPreviewImages[label] || "/megamenu-platform.jpg"
//   }

//   return (
//     <div ref={containerRef} className="relative group">
//       <button
//         onClick={() => {
//           if (isMobile) {
//             setIsOpen(!isOpen)
//           }
//         }}
//         onMouseEnter={() => {
//           if (!isMobile) {
//             handleMouseEnter()
//             setHoveredItem(null) // Reset to default preview
//           }
//         }}
//         onMouseLeave={() => {
//           if (!isMobile) {
//             handleMouseLeave()
//           }
//         }}
//         className="px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 relative group/button flex items-center gap-1.5 hover:bg-primary/5 rounded-lg"
//       >
//         {label}
//         <ChevronDown
//           className={`w-4 h-4 transition-transform duration-300 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         />
//         <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover/button:w-6 transition-all duration-300 -translate-x-1/2 rounded-full" />
//       </button>

//       {/* Megamenu Panel - Desktop */}
//       {isOpen && !isMobile && (
//         <div
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300 hidden lg:block"
//         >
//           <div className="relative bg-background/98 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden w-[1000px]">
//             {/* Ambient background effects */}
//             <div className="absolute inset-0 pointer-events-none overflow-hidden">
//               <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl -z-10" />
//               <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
//             </div>
//             {/* Content Grid */}
//             <div className="grid grid-cols-3 gap-0">
//               {/* Left Column - Menu Items */}
//               <div className="col-span-1 border-r border-border/30 py-6 px-6 max-h-[500px] overflow-y-auto">
//                 <div className="space-y-1">
//                   {sections.map((section) => (
//                     <div key={section.title} className="mb-6">
//                       <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
//                         {section.title}
//                       </h3>
//                       <div className="space-y-1">
//                         {section.items.map((item) => (
//                           <Link
//                             key={item.title}
//                             href={item.href}
//                             onMouseEnter={() => setHoveredItem(item.title)}
//                             onClick={() => setIsOpen(false)}
//                             className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group/item ${
//                               hoveredItem === item.title
//                                 ? "bg-primary/10 text-foreground"
//                                 : "text-muted-foreground hover:text-foreground hover:bg-background/50"
//                             }`}
//                           >
//                             <div className="mt-0.5 text-primary group-hover/item:scale-110 transition-transform duration-300">
//                               {item.icon}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <div className="text-sm font-medium leading-tight">
//                                 {item.title}
//                               </div>
//                               {item.description && (
//                                 <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
//                                   {item.description}
//                                 </div>
//                               )}
//                             </div>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Right Column - Preview with Image */}
//               <div className="col-span-2 py-10 px-10 relative overflow-hidden flex flex-col">
//                 {/* Preview Image - shows default or hovered item preview */}
//                 <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-background h-56 relative group/image">
//                   <Image
//                     src={getPreviewImage() || "/placeholder.svg"}
//                     alt={label}
//                     fill
//                     className="object-cover transition-transform duration-500 group-hover/image:scale-105"
//                     priority
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
//                 </div>

//                 {/* Content Section */}
//                 <div className="flex-1">
//                   {sections.map((section) => (
//                     <div key={section.title}>
//                       {section.items.map((item) => (
//                         hoveredItem === item.title && section.preview && (
//                           <div
//                             key={item.title}
//                             className="animate-in fade-in duration-300"
//                           >
//                             <h2 className="text-2xl font-bold text-foreground mb-3">
//                               {section.preview.title}
//                             </h2>
//                             <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">
//                               {section.preview.description}
//                             </p>

//                             {section.preview.cta && (
//                               <Button
//                                 asChild
//                                 className="group/cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 h-11 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
//                               >
//                                 <Link href={section.preview.cta.href}>
//                                   {section.preview.cta.label}
//                                   <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
//                                 </Link>
//                               </Button>
//                             )}
//                           </div>
//                         )
//                       ))}
//                     </div>
//                   ))}

//                   {/* Default state - show when nothing hovered */}
//                   {!hoveredItem && (
//                     <div className="animate-in fade-in duration-300">
//                       <h2 className="text-2xl font-bold text-foreground mb-3">
//                         Explore {label}
//                       </h2>
//                       <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
//                         Hover over the menu items on the left to discover powerful features and capabilities designed to transform your workflow.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Expanded Menu */}
//       {isOpen && isMobile && (
//         <div className="absolute left-0 right-0 top-full mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 lg:hidden">
//           <div className="bg-background/98 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden mx-4">
//             {/* Mobile Layout - Vertical stack */}
//             <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
//               {sections.map((section) => (
//                 <div key={section.title} className="space-y-2">
//                   <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
//                     {section.title}
//                   </h3>
//                   <div className="space-y-1">
//                     {section.items.map((item) => (
//                       <button
//                         key={item.title}
//                         onClick={() => {
//                           setHoveredItem(item.title)
//                         }}
//                         className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
//                           hoveredItem === item.title
//                             ? "bg-primary/15 text-foreground"
//                             : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
//                         }`}
//                       >
//                         <div className="mt-0.5 text-primary flex-shrink-0">
//                           {item.icon}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-semibold leading-tight">
//                             {item.title}
//                           </div>
//                           {item.description && (
//                             <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
//                               {item.description}
//                             </div>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}

//               {/* Mobile Preview Section */}
//               {hoveredItem && (
//                 <div className="border-t border-border/30 pt-4 mt-4 animate-in fade-in duration-300">
//                   <div className="rounded-xl overflow-hidden bg-muted/50 h-40 mb-4 relative">
//                     <Image
//                       src={getPreviewImage() || "/placeholder.svg"}
//                       alt={label}
//                       fill
//                       className="object-cover"
//                       priority
//                     />
//                   </div>

//                   {sections.map((section) =>
//                     section.items.map((item) => (
//                       hoveredItem === item.title && section.preview && (
//                         <div key={item.title} className="space-y-3">
//                           <div>
//                             <h3 className="font-semibold text-foreground text-sm mb-1">
//                               {section.preview.title}
//                             </h3>
//                             <p className="text-xs text-muted-foreground line-clamp-2">
//                               {section.preview.description}
//                             </p>
//                           </div>
//                           {section.preview.cta && (
//                             <Button
//                               asChild
//                               size="sm"
//                               className="w-full group/cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs rounded-lg transition-all duration-300"
//                             >
//                               <Link href={section.preview.cta.href} onClick={() => setIsOpen(false)}>
//                                 {section.preview.cta.label}
//                                 <ArrowRight className="w-3 h-3 ml-1.5 group-hover/cta:translate-x-0.5 transition-transform" />
//                               </Link>
//                             </Button>
//                           )}
//                         </div>
//                       )
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ArrowRight, Zap, BarChart3, Layers, Users, BookOpen, Sparkles, Settings, Shield, FileText, Briefcase, Award, MessageSquare, Mail, Send, Flame, Brain, PieChart, Plus, GitBranch, Building2, Server } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuItemContent {
  icon: React.ReactNode
  title: string
  description?: string
  href: string
  previewImage?: string
  previewTitle?: string
  previewDescription?: string
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

const defaultPreviewImages: Record<string, string> = {
  Platform: "/images/megamenu/campaigns.jpg",
  Dashboard: "/images/megamenu/analytics.jpg",
  Solutions: "/images/megamenu/compare.jpg",
  Resources: "/images/megamenu/resources.jpg",
  Company: "/images/megamenu/campaigns.jpg",
}

export function MegaMenu({ label, sections }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const detectMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    detectMobile()
    window.addEventListener("resize", detectMobile)

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("resize", detectMobile)
    }
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

  const getPreviewImage = () => {
    return defaultPreviewImages[label] || "/images/megamenu/platform.jpg"
  }

  return (
    <div ref={containerRef} className="relative group">
      <button
        onClick={() => {
          if (isMobile) {
            setIsOpen(!isOpen)
          }
        }}
        onMouseEnter={() => {
          if (!isMobile) {
            handleMouseEnter()
            setHoveredItem(null)
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            handleMouseLeave()
          }
        }}
        className="px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 relative group/button flex items-center gap-1.5 hover:bg-primary/5 rounded-lg"
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover/button:w-6 transition-all duration-300 -translate-x-1/2 rounded-full" />
      </button>

      {/* Megamenu Panel - Desktop */}
      {isOpen && !isMobile && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300 hidden lg:block"
        >
          <div className="relative bg-background/98 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden w-[1000px]">
            {/* Ambient background effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
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
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group/item ${hoveredItem === item.title
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

              {/* Right Column - Preview with Image */}
              <div className="col-span-2 py-10 px-10 relative overflow-hidden flex flex-col">
                {/* Get the hovered item for preview */}
                {(() => {
                  const hoveredItemData = hoveredItem
                    ? sections.flatMap(s => s.items).find(item => item.title === hoveredItem)
                    : null;

                  const previewImage = hoveredItemData?.previewImage || getPreviewImage();
                  const previewTitle = hoveredItemData?.previewTitle || hoveredItemData?.title || `Explore ${label}`;
                  const previewDescription = hoveredItemData?.previewDescription || hoveredItemData?.description || "Hover over the menu items to discover all the features and resources available to help you succeed with Mailfra.";

                  return (
                    <>
                      {/* Preview Image */}
                      <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-background h-56 relative group/image">
                        <Image
                          src={previewImage || "/placeholder.svg"}
                          alt={previewTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 animate-in fade-in duration-300">
                        <h2 className="text-2xl font-bold text-foreground mb-3">
                          {previewTitle}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-6">
                          {previewDescription}
                        </p>

                        {hoveredItemData && (
                          <Button
                            asChild
                            className="group/cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 h-11 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                          >
                            <Link href={hoveredItemData.href}>
                              {`Explore ${hoveredItemData.title}`}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-1 transition-transform duration-300" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Expanded Menu */}
      {isOpen && isMobile && (
        <div className="absolute left-0 right-0 top-full mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300 lg:hidden">
          <div className="bg-background/98 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden mx-4">
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {sections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                      >
                        <div className="mt-0.5 text-primary flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold leading-tight">
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
        </div>
      )}
    </div>
  )
}

// Menu configurations with all actual pages
export const platformMenuSections: MenuSection[] = [
  {
    title: "Dashboard Features",
    items: [
      {
        icon: <Mail className="w-5 h-5" />,
        title: "Campaigns",
        description: "Create and manage cold email campaigns",
        href: "/dashboard/campaigns",
      },
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Analytics & Reports",
        description: "Real-time campaign performance tracking",
        href: "/dashboard/analytics",
      },
      {
        icon: <Send className="w-5 h-5" />,
        title: "Prospects & CRM",
        description: "Manage leads and customer relationships",
        href: "/dashboard/prospects",
      },
      {
        icon: <GitBranch className="w-5 h-5" />,
        title: "Sequences",
        description: "Build automated follow-up sequences",
        href: "/dashboard/sequences",
      },
      {
        icon: <Flame className="w-5 h-5" />,
        title: "Email Warmup",
        description: "Maximize inbox placement & deliverability",
        href: "/dashboard/warmup",
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: "AI Generation Tools",
        description: "AI-powered email writing and prediction",
        href: "/dashboard/generate",
      },
    ],
    preview: {
      title: "Get Started with Mailfra",
      description: "Access your dashboard to create campaigns, manage prospects, set up email sequences, optimize deliverability with our warmup engine, and leverage AI tools to write better emails.",
      cta: { label: "Go to Dashboard", href: "/dashboard" },
    },
  },
  {
    title: "Core Features",
    items: [
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "AI-Powered Outreach",
        description: "Intelligent email automation",
        href: "/features",
      },
      {
        icon: <Layers className="w-5 h-5" />,
        title: "Integrations",
        description: "Connect your favorite tools",
        href: "/integrations",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Email Templates",
        description: "Professional pre-built templates",
        href: "/dashboard/templates",
      },
    ],
  },
]

export const productMenuSections: MenuSection[] = [
  {
    title: "Compare",
    items: [
      {
        icon: <Award className="w-5 h-5" />,
        title: "vs Instantly",
        description: "See how we compare",
        href: "/compare/instantly",
      },
      {
        icon: <Award className="w-5 h-5" />,
        title: "vs Smartlead",
        description: "Feature comparison",
        href: "/compare/smartlead",
      },
      {
        icon: <Award className="w-5 h-5" />,
        title: "vs Lemlist",
        description: "Detailed comparison",
        href: "/compare/lemlist",
      },
      {
        icon: <Award className="w-5 h-5" />,
        title: "vs Apollo",
        description: "Full feature matrix",
        href: "/compare/apollo",
      },
    ],
    preview: {
      title: "Why Choose Mailfra",
      description: "Compare Mailfra with other platforms and discover why we're the best choice for your cold email campaigns.",
      cta: { label: "View Comparisons", href: "/compare" },
    },
  },
  {
    title: "Solutions",
    items: [
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Case Studies",
        description: "Real results from real customers",
        href: "/case-studies",
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "Pricing",
        description: "Transparent pricing for all plans",
        href: "/pricing",
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Partners",
        description: "Grow with our partner program",
        href: "/partners",
      },
    ],
  },
]

export const resourcesMenuSections: MenuSection[] = [
  {
    title: "Learning",
    items: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        title: "Blog",
        description: "Latest insights and strategies",
        href: "/blog",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Guides & Tutorials",
        description: "Step-by-step learning resources",
        href: "/guides",
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "API Documentation",
        description: "Developer resources",
        href: "/api-docs",
      },
      {
        icon: <MessageSquare className="w-5 h-5" />,
        title: "Help Center",
        description: "Support and FAQ",
        href: "/help",
      },
    ],
    preview: {
      title: "Learn & Grow",
      description: "Access comprehensive guides, tutorials, and documentation to master Mailfra and maximize your cold email success.",
      cta: { label: "Browse Resources", href: "/guides" },
    },
  },
  {
    title: "Community",
    items: [
      {
        icon: <Users className="w-5 h-5" />,
        title: "Webinars",
        description: "Live training sessions",
        href: "/webinars",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Changelog",
        description: "Latest product updates",
        href: "/changelog",
      },
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Roadmap",
        description: "What's coming next",
        href: "/roadmap",
      },
    ],
  },
]

export const dashboardMenuSections: MenuSection[] = [
  {
    title: "Campaigns",
    items: [
      {
        icon: <Mail className="w-5 h-5" />,
        title: "All Campaigns",
        description: "View all your campaigns",
        href: "/dashboard/campaigns",
      },
      {
        icon: <Plus className="w-5 h-5" />,
        title: "Create New",
        description: "Start a new campaign",
        href: "/dashboard/campaigns/new",
      },
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Analytics",
        description: "Track performance",
        href: "/dashboard/analytics",
      },
    ],
    preview: {
      title: "Manage Your Campaigns",
      description: "Create, monitor, and optimize your cold email campaigns with real-time analytics and performance tracking.",
      cta: { label: "Go to Campaigns", href: "/dashboard/campaigns" },
    },
  },
  {
    title: "Outreach",
    items: [
      {
        icon: <Users className="w-5 h-5" />,
        title: "Prospects",
        description: "Manage your leads",
        href: "/dashboard/prospects",
      },
      {
        icon: <Building2 className="w-5 h-5" />,
        title: "CRM",
        description: "Customer relationships",
        href: "/dashboard/crm",
      },
      {
        icon: <GitBranch className="w-5 h-5" />,
        title: "Sequences",
        description: "Automated follow-ups",
        href: "/dashboard/sequences",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Templates",
        description: "Email templates",
        href: "/dashboard/templates",
      },
    ],
  },
  {
    title: "Deliverability",
    items: [
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "Overview",
        description: "Deliverability metrics",
        href: "/dashboard/deliverability",
      },
      {
        icon: <Flame className="w-5 h-5" />,
        title: "Email Warmup",
        description: "Warm up your accounts",
        href: "/dashboard/warmup",
      },
      {
        icon: <Server className="w-5 h-5" />,
        title: "Email Setup",
        description: "Configure your emails",
        href: "/dashboard/email-setup",
      },
    ],
  },
  {
    title: "AI Tools",
    items: [
      {
        icon: <Sparkles className="w-5 h-5" />,
        title: "AI Generator",
        description: "Generate emails",
        href: "/dashboard/generate",
      },
      {
        icon: <BarChart3 className="w-5 h-5" />,
        title: "AI Predictor",
        description: "Predict response rates",
        href: "/dashboard/predict",
      },
    ],
  },
]

export const companyMenuSections: MenuSection[] = [
  {
    title: "Company",
    items: [
      {
        icon: <Briefcase className="w-5 h-5" />,
        title: "About Us",
        description: "Our mission and team",
        href: "/about",
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: "Careers",
        description: "Join our growing team",
        href: "/careers",
      },
      {
        icon: <MessageSquare className="w-5 h-5" />,
        title: "Contact",
        description: "Get in touch with us",
        href: "/contact",
      },
      {
        icon: <Award className="w-5 h-5" />,
        title: "Press & Media",
        description: "Latest news and announcements",
        href: "/press",
      },
    ],
    preview: {
      title: "About Mailfra",
      description: "Learn about our mission to revolutionize cold email, meet our team, and explore career opportunities.",
      cta: { label: "Learn More", href: "/about" },
    },
  },
  {
    title: "Legal",
    items: [
      {
        icon: <Shield className="w-5 h-5" />,
        title: "Privacy Policy",
        description: "How we protect your data",
        href: "/privacy",
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: "Terms of Service",
        description: "Terms and conditions",
        href: "/terms",
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: "Security",
        description: "Enterprise-grade security",
        href: "/security",
      },
    ],
  },
]
