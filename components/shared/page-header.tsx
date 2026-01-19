
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
//           ? "bg-background backdrop-blur-2xl border-b border-border/40 shadow-lg shadow-black/5"
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
import { Menu, X, ArrowRight, Zap, Mail, Users, BarChart3, Shield, Workflow, Brain, Globe, Code2, Rocket, Lock, BookOpen, MessageSquare, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MegaMenu } from "@/components/mega-menu/mega-menu"
import { useTheme } from "next-themes"

const megaMenus = [
  {
    label: "Platform",
    sections: [
      {
        title: "Core Features",
        items: [
          { icon: <Mail className="w-5 h-5" />, title: "Smart Inbox", description: "Intelligent email management", href: "/features/inbox" },
          { icon: <Zap className="w-5 h-5" />, title: "Sequence Builder", description: "Visual campaign designer", href: "/features/sequences" },
          { icon: <Brain className="w-5 h-5" />, title: "AI Assistant", description: "Content generation & optimization", href: "/features/ai-assistant" },
        ],
        preview: {
          title: "Smart Inbox",
          description: "Consolidate all your emails in one unified interface. Filter, tag, and automate responses with intelligent rules and prioritization algorithms.",
          cta: { label: "Explore Platform", href: "/features/inbox" },
        },
      },
      {
        title: "Integrations",
        items: [
          { icon: <Code2 className="w-5 h-5" />, title: "API Suite", description: "Webhooks & REST endpoints", href: "/developers/api" },
          { icon: <Globe className="w-5 h-5" />, title: "Connectors", description: "50+ third-party apps", href: "/integrations" },
          { icon: <Workflow className="w-5 h-5" />, title: "Automation", description: "Zapier, Make & more", href: "/features/automation" },
        ],
        preview: {
          title: "API Suite",
          description: "Build powerful integrations with our complete REST API and webhooks. Full documentation and SDKs for JavaScript, Python, and Go included.",
          cta: { label: "View API Docs", href: "/developers/api" },
        },
      },
    ],
  },
  {
    label: "Solutions",
    sections: [
      {
        title: "By Business Type",
        items: [
          { icon: <Rocket className="w-5 h-5" />, title: "Growth Teams", description: "Scale acquisition efficiently", href: "/solutions/growth" },
          { icon: <Users className="w-5 h-5" />, title: "Enterprise", description: "Advanced security & controls", href: "/solutions/enterprise" },
          { icon: <BarChart3 className="w-5 h-5" />, title: "Agencies", description: "Multi-client management", href: "/solutions/agencies" },
        ],
        preview: {
          title: "Growth Teams",
          description: "Accelerate customer acquisition with proven outreach strategies. Get analytics, A/B testing, and optimization recommendations built-in.",
          cta: { label: "Start Growing", href: "/solutions/growth" },
        },
      },
      {
        title: "Verticals",
        items: [
          { icon: <Lock className="w-5 h-5" />, title: "Financial Services", description: "Compliance-first approach", href: "/solutions/fintech" },
          { icon: <Workflow className="w-5 h-5" />, title: "B2B SaaS", description: "Enterprise GTM strategies", href: "/solutions/saas" },
        ],
        preview: {
          title: "Financial Services",
          description: "SOC 2 Type II certified platform with enterprise-grade security. GDPR, CCPA, and regulatory compliance built into every feature.",
          cta: { label: "Learn More", href: "/solutions/fintech" },
        },
      },
    ],
  },
  {
    label: "Developers",
    sections: [
      {
        title: "Documentation",
        items: [
          { icon: <BookOpen className="w-5 h-5" />, title: "Getting Started", description: "5-minute setup guide", href: "/docs/quickstart" },
          { icon: <Code2 className="w-5 h-5" />, title: "API Reference", description: "Complete endpoint docs", href: "/docs/api-reference" },
          { icon: <MessageSquare className="w-5 h-5" />, title: "Guides", description: "Tutorials & best practices", href: "/docs/guides" },
        ],
        preview: {
          title: "Getting Started",
          description: "Set up your first integration in under 5 minutes. Our interactive guides cover authentication, rate limiting, and common use cases.",
          cta: { label: "Start Building", href: "/docs/quickstart" },
        },
      },
      {
        title: "Community",
        items: [
          { icon: <Globe className="w-5 h-5" />, title: "Community Forum", description: "Ask questions & share ideas", href: "/community" },
          { icon: <Headphones className="w-5 h-5" />, title: "Developer Support", description: "Dedicated technical help", href: "/developers/support" },
        ],
        preview: {
          title: "Community Forum",
          description: "Join 10,000+ developers building with our platform. Share code, ask questions, and get exclusive beta access to new features.",
          cta: { label: "Join Community", href: "/community" },
        },
      },
    ],
  },
  {
    label: "Company",
    sections: [
      {
        title: "About",
        items: [
          { icon: <Rocket className="w-5 h-5" />, title: "Our Story", description: "From startup to market leader", href: "/about" },
          { icon: <Users className="w-5 h-5" />, title: "Careers", description: "Join our growing team", href: "/careers" },
          { icon: <Globe className="w-5 h-5" />, title: "Blog", description: "News, insights & releases", href: "/blog" },
        ],
        preview: {
          title: "Our Story",
          description: "Founded in 2020, we've helped 50,000+ users deliver 2 billion emails with a 45% average reply rate. See how we got here.",
          cta: { label: "Read Our Blog", href: "/blog" },
        },
      },
      {
        title: "Legal",
        items: [
          { icon: <Lock className="w-5 h-5" />, title: "Security", description: "Trust & compliance info", href: "/security" },
          { icon: <Shield className="w-5 h-5" />, title: "Privacy", description: "Data protection policy", href: "/privacy" },
        ],
        preview: {
          title: "Security",
          description: "Enterprise-grade infrastructure with 99.99% uptime SLA. All data encrypted in transit and at rest with regular security audits.",
          cta: { label: "View Trust Center", href: "/security" },
        },
      },
    ],
  },
]

const staticLinks = [
  { href: "/pricing", label: "Pricing" },
]

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/resources", label: "Resources" },
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
          <nav className="hidden md:flex items-center gap-0">
            {megaMenus.map((menu) => (
              <MegaMenu key={menu.label} label={menu.label} sections={menu.sections} />
            ))}
            {staticLinks.map((link) => (
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
          <div className="md:hidden border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-300 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col py-4">
              {megaMenus.map((menu) => (
                <div key={menu.label} className="border-b border-border/30 last:border-0">
                  <h3 className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40">{menu.label}</h3>
                  <div className="space-y-0.5 py-2">
                    {menu.sections.map((section) =>
                      section.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="px-6 py-3.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-start gap-3 active:bg-primary/10"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className="text-primary mt-0.5 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium leading-tight">{item.title}</div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground mt-1 leading-snug">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ))}
              
              {/* Pricing Link */}
              <div className="border-b border-border/30 py-2">
                <h3 className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40">Quick Links</h3>
                {staticLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-6 py-3.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 block active:bg-primary/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* CTA Section */}
              <div className="px-4 py-6 space-y-3 bg-gradient-to-b from-primary/5 to-transparent">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="w-full justify-center font-semibold border-primary/30 hover:border-primary/60 hover:bg-background transition-all duration-300 bg-transparent"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild 
                  className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                >
                  <Link href="/sign-up" className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-2">No credit card required</p>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default PageHeader
