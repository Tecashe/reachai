
// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"

// const navLinks = [
//   { href: "/features", label: "Features" },
//   { href: "/pricing", label: "Pricing" },
//   { href: "/integrations", label: "Integrations" },
//   { href: "/blog", label: "Blog" },
// ]

// export function PageHeader() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20)
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="/mailfra-logo.png"
//               alt="Mailfra"
//               width={36}
//               height={36}
//               className="w-9 h-9 rounded-xl object-contain"
//               priority
//             />
//             <span className="font-semibold text-lg text-foreground">mailfra</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* CTA Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/sign-in">Sign In</Link>
//             </Button>
//             <Button size="sm" asChild>
//               <Link href="/sign-up">Start Free Trial</Link>
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 border-t border-border">
//             <nav className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="flex flex-col gap-2 pt-4 border-t border-border">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href="/sign-in">Sign In</Link>
//                 </Button>
//                 <Button size="sm" asChild>
//                   <Link href="/sign-up">Start Free Trial</Link>
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default PageHeader


// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useTheme } from "next-themes"

// const navLinks = [
//   { href: "/features", label: "Features" },
//   { href: "/pricing", label: "Pricing" },
//   { href: "/integrations", label: "Integrations" },
//   { href: "/blog", label: "Blog" },
// ]

// export function PageHeader() {
//   const [scrolled, setScrolled] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const { theme, resolvedTheme } = useTheme()
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//     const handleScroll = () => setScrolled(window.scrollY > 20)
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   // Determine which logo to show
//   const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light"
//   const logoSrc = currentTheme === "dark" ? "/mailfra-logo-dark.png" : "/mailfra-logo-light.png"

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           <Link href="/" className="flex items-center gap-2">
//             {mounted && (
//               <Image
//                 src={logoSrc}
//                 alt="Mailfra"
//                 width={36}
//                 height={36}
//                 className="w-9 h-9 object-contain"
//                 priority
//               />
//             )}
//             <span className="font-semibold text-lg text-foreground">mailfra</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* CTA Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             <Button variant="ghost" size="sm" asChild>
//               <Link href="/sign-in">Sign In</Link>
//             </Button>
//             <Button size="sm" asChild>
//               <Link href="/sign-up">Start Free Trial</Link>
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
//             {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 border-t border-border">
//             <nav className="flex flex-col gap-4">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="flex flex-col gap-2 pt-4 border-t border-border">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href="/sign-in">Sign In</Link>
//                 </Button>
//                 <Button size="sm" asChild>
//                   <Link href="/sign-up">Start Free Trial</Link>
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default PageHeader
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/integrations", label: "Integrations" },
  { href: "/blog", label: "Blog" },
]

export function PageHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light"
  const logoSrc = currentTheme === "dark" ? "/mailfra-logo-dark.png" : "/mailfra-logo-light.png"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "glass-navbar-scrolled" : "glass-navbar"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo with 3D effect */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            {mounted && (
              <div className="logo-3d relative w-10 h-10 flex items-center justify-center rounded-lg">
                <Image
                  src={logoSrc || "/placeholder.svg"}
                  alt="Mailfra"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain transition-all duration-300"
                  priority
                />
              </div>
            )}
            <span className="text-lg md:text-xl font-bold text-foreground transition-all duration-300 group-hover:text-primary">
              mailfra
            </span>
          </Link>

          {/* Navigation Links with premium styling */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons with glass effect */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-transparent transition-all duration-300 px-4"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="btn-3d-primary text-sm font-semibold px-6 py-2 h-auto rounded-lg">
              <Link href="/sign-up" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 text-foreground transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu with premium glass effect */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 px-2 border-t border-border/30 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-1 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
              <Button variant="ghost" size="sm" asChild className="w-full justify-center text-sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="btn-3d-primary w-full justify-center font-semibold">
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
