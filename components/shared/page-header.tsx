// "use client"

// import { Mail, Menu, X } from "lucide-react"
// import Link from "next/link"
// import { cn } from "@/lib/utils"
// import Image from "next/image"
// import { useEffect, useState } from "react"

// export function PageHeader() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const navLinks = [
//     { href: "/features", label: "Features" },
//     { href: "/pricing", label: "Pricing" },
//     { href: "/integrations", label: "Integrations" },
//     { href: "/api-docs", label: "API" },
//     { href: "/blog", label: "Blog" },
//   ]

//   return (
//     <>
//       <header
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 md:h-20">
//             {/* Logo */}
//             <div className={cn("p-6 border-b border-border/50 transition-all duration-300")}>
//                      <Link href="/dashboard" className="flex items-center gap-2 group">
//                        <div className="relative h-10 w-10 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
//                          <Image
//                            src="/logo.png"
//                            alt="mailfra Logo"
//                            width={40}
//                            height={40}
//                            className="object-contain"
//                            priority
//                          />
//                        </div>
//                          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
//                            Mailfra
//                          </span>
//                      </Link>
//                    </div>
//             {/* <Link href="/" className="flex items-center gap-2">
//               <div
//                 className="w-9 h-9 rounded-xl flex items-center justify-center"
//                 style={{
//                   background: "linear-gradient(135deg, #111 0%, #333 100%)",
//                   boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 <Mail className="w-4 h-4 text-white" />
//               </div>
//               <span className="font-semibold text-lg text-foreground">mailfra</span>
//             </Link> */}

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center gap-8">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//             </nav>

//             {/* Desktop CTA */}
//             <div className="hidden md:flex items-center gap-4">
//               <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
//                 Log in
//               </Link>
//               <Link
//                 href="/signup"
//                 className="h-10 px-5 bg-foreground text-background text-sm font-medium rounded-full flex items-center hover:bg-foreground/90 transition-colors"
//               >
//                 Start Free Trial
//               </Link>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden w-10 h-10 flex items-center justify-center"
//             >
//               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       {mobileMenuOpen && (
//         <div className="fixed inset-0 z-40 bg-background md:hidden">
//           <div className="pt-20 px-6">
//             <nav className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="text-lg font-medium text-foreground py-3 border-b border-border"
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="pt-6 flex flex-col gap-3">
//                 <Link
//                   href="/login"
//                   className="h-12 flex items-center justify-center border border-border rounded-full text-foreground font-medium"
//                 >
//                   Log in
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="h-12 flex items-center justify-center bg-foreground text-background rounded-full font-medium"
//                 >
//                   Start Free Trial
//                 </Link>
//               </div>
//             </nav>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default PageHeader


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/integrations", label: "Integrations" },
  { href: "/blog", label: "Blog" },
]

export function PageHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mailfra-logo.png"
              alt="Mailfra"
              width={36}
              height={36}
              className="w-9 h-9 rounded-xl object-contain"
              priority
            />
            <span className="font-semibold text-lg text-foreground">mailfra</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
