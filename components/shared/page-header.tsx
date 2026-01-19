
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


// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Menu, X, ArrowRight } from "lucide-react"
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
//     const handleScroll = () => setScrolled(window.scrollY > 50)
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light"
//   const logoSrc = currentTheme === "dark" ? "/mailfra-logo-dark.png" : "/mailfra-logo-light.png"

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         scrolled
//           ? "bg-background/70 backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-black/5"
//           : "bg-transparent border-b border-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 md:h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
//             {mounted && (
//               <div className="relative">
//                 <Image
//                   src={logoSrc || "/placeholder.svg"}
//                   alt="Mailfra"
//                   width={40}
//                   height={40}
//                   className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
//                   priority
//                 />
//               </div>
//             )}
//             <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-300">
//               mailfra
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-2">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
//               >
//                 {link.label}
//                 <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-8 transition-all duration-300 -translate-x-1/2" />
//               </Link>
//             ))}
//           </nav>

//           {/* CTA Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             <Button
//               variant="ghost"
//               size="sm"
//               asChild
//               className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
//             >
//               <Link href="/sign-in">Sign In</Link>
//             </Button>
//             <Button
//               size="sm"
//               asChild
//               className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group flex items-center gap-2"
//             >
//               <Link href="/sign-up">
//                 Start Free Trial
//                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//               </Link>
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden p-2 rounded-lg hover:bg-background/50 transition-all duration-300"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             aria-label="Toggle menu"
//           >
//             {mobileMenuOpen ? (
//               <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
//             ) : (
//               <Menu className="w-6 h-6 transition-transform duration-300" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-6 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
//             <nav className="flex flex-col gap-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg transition-all duration-300"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               ))}
//               <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border/40">
//                 <Button variant="ghost" size="sm" asChild className="w-full justify-center">
//                   <Link href="/sign-in">Sign In</Link>
//                 </Button>
//                 <Button size="sm" asChild className="w-full justify-center bg-primary hover:bg-primary/90">
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-black/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer transition-all duration-300">
            {mounted && (
              <div className="relative">
                <Image
                  src={logoSrc || "/placeholder.svg"}
                  alt="Mailfra"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
              </div>
            )}
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-all duration-300">
              mailfra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-8 transition-all duration-300 -translate-x-1/2" />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group flex items-center gap-2"
            >
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-background/50 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-border/40">
                <Button variant="ghost" size="sm" asChild className="w-full justify-center">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="w-full justify-center bg-primary hover:bg-primary/90">
                  <Link href="/sign-up">Start Free Trial</Link>
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
