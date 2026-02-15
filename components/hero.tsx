
// // "use client"

// // import { Button } from "@/components/ui/button"
// // import { ArrowRight, Play, Menu, X, Zap, Globe, Shield, Check } from "lucide-react"
// // import Link from "next/link"
// // import { useEffect, useState, useRef } from "react"
// // import Image from "next/image"

// // export function Hero() {
// //   const sectionRef = useRef<HTMLDivElement>(null)
// //   const [scrollProgress, setScrollProgress] = useState(0)
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
// //   const [showNavbar, setShowNavbar] = useState(true)
// //   const [isPastHero, setIsPastHero] = useState(false)
// //   const [isDark, setIsDark] = useState(false)
// //   const lastScrollY = useRef(0)

// //   useEffect(() => {
// //     const checkDarkMode = () => {
// //       setIsDark(document.documentElement.classList.contains("dark"))
// //     }
// //     checkDarkMode()

// //     const observer = new MutationObserver(checkDarkMode)
// //     observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

// //     return () => observer.disconnect()
// //   }, [])

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       if (!sectionRef.current) return
// //       const rect = sectionRef.current.getBoundingClientRect()
// //       const sectionHeight = sectionRef.current.offsetHeight
// //       const viewportHeight = window.innerHeight
// //       const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)))
// //       setScrollProgress(progress)

// //       const currentScrollY = window.scrollY
// //       const heroBottom = sectionRef.current.offsetHeight
// //       const pastHero = currentScrollY > heroBottom - viewportHeight

// //       setIsPastHero(pastHero)

// //       if (pastHero) {
// //         if (currentScrollY < lastScrollY.current) {
// //           setShowNavbar(true)
// //         } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
// //           setShowNavbar(false)
// //         }
// //       } else {
// //         setShowNavbar(true)
// //       }

// //       lastScrollY.current = currentScrollY
// //     }

// //     window.addEventListener("scroll", handleScroll, { passive: true })
// //     handleScroll()
// //     return () => window.removeEventListener("scroll", handleScroll)
// //   }, [])

// //   const phase1Progress = Math.min(1, scrollProgress * 2.5)
// //   const phase2Progress = Math.max(0, Math.min(1, (scrollProgress - 0.4) * 1.8))

// //   // Navbar transitions - simplified for 2 phases
// //   const navTransition = Math.min(1, scrollProgress * 2)
// //   const navScrolled = scrollProgress > 0.3

// //   const contentOpacity = 1 - phase1Progress * 1.2
// //   const contentScale = 1 - phase1Progress * 0.15
// //   const contentY = phase1Progress * -80

// //   const finalOpacity = phase2Progress
// //   const finalScale = 0.95 + phase2Progress * 0.05
// //   const finalY = 40 - phase2Progress * 40

// //   return (
// //     <section ref={sectionRef} className="relative min-h-[260vh]">
// //       <div className="sticky top-0 h-screen overflow-hidden">
// //         {/* Refined background */}
// //         <div className="absolute inset-0 pointer-events-none">
// //           {/* Subtle gradient overlay */}
// //           <div
// //             className="absolute inset-0 transition-opacity duration-1000"
// //             style={{
// //               background: isDark
// //                 ? "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.01 280 / 0.5) 0%, transparent 70%)"
// //                 : "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.96 0.005 90 / 0.8) 0%, transparent 70%)",
// //               opacity: 1 - phase1Progress * 0.5,
// //             }}
// //           />

// //           {/* Subtle grid pattern */}
// //           <div
// //             className="absolute inset-0"
// //             style={{
// //               backgroundImage: isDark
// //                 ? "linear-gradient(oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px)"
// //                 : "linear-gradient(oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px)",
// //               backgroundSize: "80px 80px",
// //               opacity: 0.5 - scrollProgress * 0.3,
// //             }}
// //           />

// //           {/* Refined noise texture */}
// //           <div
// //             className="absolute inset-0"
// //             style={{
// //               opacity: isDark ? 0.03 : 0.02,
// //               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
// //             }}
// //           />
// //         </div>

// //         {/* === REFINED GLASSMORPHIC NAVBAR === */}
// //         <nav
// //           className="fixed left-1/2 z-50 flex items-center justify-between transition-all duration-500 ease-out"
// //           style={{
// //             top: "20px",
// //             width: navScrolled ? "min(92%, 900px)" : "min(95%, 1100px)",
// //             height: "60px",
// //             transform: `translateX(-50%) translateY(${showNavbar ? 0 : -100}px)`,
// //             opacity: showNavbar ? 1 : 0,
// //             borderRadius: navScrolled ? "16px" : "9999px",
// //             background: isDark
// //               ? navScrolled
// //                 ? "linear-gradient(135deg, oklch(0.14 0.006 285 / 0.95), oklch(0.12 0.006 285 / 0.9))"
// //                 : "linear-gradient(135deg, oklch(0.14 0.006 285 / 0.85), oklch(0.12 0.006 285 / 0.75))"
// //               : navScrolled
// //                 ? "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.98), oklch(0.99 0.002 90 / 0.95))"
// //                 : "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.9), oklch(0.99 0.002 90 / 0.8))",
// //             backdropFilter: `blur(${navScrolled ? 32 : 20}px) saturate(180%)`,
// //             boxShadow: isDark
// //               ? navScrolled
// //                 ? "0 20px 50px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(1 0 0 / 0.06) inset"
// //                 : "0 15px 40px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(1 0 0 / 0.05) inset"
// //               : navScrolled
// //                 ? "0 20px 50px oklch(0.12 0.005 285 / 0.08), 0 0 0 1px oklch(1 0 0 / 0.8) inset"
// //                 : "0 15px 40px oklch(0.12 0.005 285 / 0.06), 0 0 0 1px oklch(1 0 0 / 0.9) inset",
// //             border: isDark ? "1px solid oklch(1 0 0 / 0.08)" : "1px solid oklch(0.12 0.005 285 / 0.06)",
// //             padding: "0 20px",
// //           }}
// //         >
// //           {/* Logo */}
// //           <Link
// //             href="/dashboard"
// //             className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
// //           >
// //             <div
// //               className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500"
// //               style={{
// //                 background: isDark
// //                   ? "linear-gradient(135deg, oklch(0.96 0.003 90), oklch(0.90 0.003 90))"
// //                   : "linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.20 0.005 285))",
// //                 boxShadow: isDark ? "0 4px 12px oklch(0 0 0 / 0.3)" : "0 4px 12px oklch(0.12 0.005 285 / 0.2)",
// //               }}
// //             >
// //               <Image
// //                 src="/mailfra-logo.png"
// //                 alt="Mailfra"
// //                 width={32}
// //                 height={32}
// //                 className={`w-5 h-5 object-contain transition-all duration-300 ${
// //                   isDark ? "brightness-0" : "brightness-0 invert"
// //                 }`}
// //                 priority
// //               />
// //             </div>
// //             <span className="font-semibold text-lg tracking-tight text-foreground">mailfra</span>
// //           </Link>

// //           {/* Navigation Links */}
// //           <div className="hidden lg:flex items-center gap-1">
// //             {["Features", "Pricing", "Customers", "Resources"].map((item) => (
// //               <Link
// //                 key={item}
// //                 href="/dashboard"
// //                 className="relative px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground hover:bg-accent/50"
// //               >
// //                 {item}
// //               </Link>
// //             ))}
// //           </div>

// //           {/* CTA Buttons */}
// //           <div className="flex items-center gap-3">
// //             <Link
// //               href="/dashboard"
// //               className="hidden md:block px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground"
// //             >
// //               Sign In
// //             </Link>
// //             <Link href="/sign-up" className="hidden sm:block">
// //               <Button
// //                 size="sm"
// //                 className="rounded-full px-5 h-10 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
// //                 style={{
// //                   background: isDark
// //                     ? "linear-gradient(135deg, oklch(0.96 0.003 90), oklch(0.90 0.003 90))"
// //                     : "linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.20 0.005 285))",
// //                   color: isDark ? "oklch(0.12 0.005 285)" : "oklch(0.96 0.003 90)",
// //                   boxShadow: isDark ? "0 8px 24px oklch(1 0 0 / 0.15)" : "0 8px 24px oklch(0.12 0.005 285 / 0.25)",
// //                 }}
// //               >
// //                 Get Started
// //               </Button>
// //             </Link>

// //             <button
// //               className="lg:hidden p-2 rounded-full transition-colors hover:bg-accent"
// //               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //             >
// //               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
// //             </button>
// //           </div>
// //         </nav>

// //         {/* Mobile Menu */}
// //         {mobileMenuOpen && (
// //           <div className="fixed inset-0 z-40 lg:hidden bg-background/98 backdrop-blur-xl">
// //             <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
// //               {["Features", "Pricing", "Customers", "Resources", "Sign In"].map((item) => (
// //                 <Link
// //                   key={item}
// //                   href="/dashboard"
// //                   onClick={() => setMobileMenuOpen(false)}
// //                   className="text-2xl font-medium transition-colors hover:text-muted-foreground"
// //                 >
// //                   {item}
// //                 </Link>
// //               ))}
// //               <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mt-4">
// //                 <Button size="lg" className="rounded-full px-8 h-14 text-lg font-medium">
// //                   Get Started
// //                   <ArrowRight className="ml-2 w-5 h-5" />
// //                 </Button>
// //               </Link>
// //             </div>
// //           </div>
// //         )}

// //         {/* === PHASE 1: HERO CONTENT === */}
// //         <div
// //           className="absolute inset-0 flex items-center justify-center pointer-events-none"
// //           style={{
// //             opacity: contentOpacity,
// //             transform: `scale(${contentScale}) translateY(${contentY}px)`,
// //           }}
// //         >
// //           <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center pointer-events-auto pt-16">
// //             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.05] mb-6 sm:mb-8 text-balance tracking-tight">
// //               Generate leads in{" "}
// //               <span className="relative inline-block">
// //                 <span className="relative z-10">14 days</span>
// //                 <svg
// //                   className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-4 sm:h-6"
// //                   viewBox="0 0 200 20"
// //                   preserveAspectRatio="none"
// //                   fill="none"
// //                 >
// //                   <path
// //                     d="M2 15 Q 15 5, 30 12 T 60 10 T 90 14 T 120 9 T 150 13 T 180 10 T 198 12"
// //                     stroke="currentColor"
// //                     strokeWidth="3"
// //                     strokeLinecap="round"
// //                     fill="none"
// //                     className="opacity-15"
// //                   />
// //                   <path
// //                     d="M5 13 Q 25 8, 50 14 T 100 10 T 150 15 T 195 11"
// //                     stroke="currentColor"
// //                     strokeWidth="4"
// //                     strokeLinecap="round"
// //                     fill="none"
// //                   />
// //                 </svg>
// //               </span>
// //               <br />
// //               <span className="text-muted-foreground/40">free to start</span>
// //             </h1>

// //             <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
// //               From lead discovery to email delivery. AI-powered personalization meets deliverability monitoring.
// //             </p>

// //             <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
// //               <Link href="/dashboard" className="w-full sm:w-auto">
// //                 <Button
// //                   size="lg"
// //                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-12 rounded-full transition-all duration-300 hover:-translate-y-1 group"
// //                 >
// //                   Start Free Trial
// //                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
// //                 </Button>
// //               </Link>
// //               <Button
// //                 size="lg"
// //                 variant="outline"
// //                 className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 rounded-full transition-all duration-300 hover:-translate-y-1 group backdrop-blur-sm bg-transparent"
// //               >
// //                 <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
// //                 Watch Demo
// //               </Button>
// //             </div>

// //             {/* Social Proof */}
// //             {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
// //               <div className="flex -space-x-3">
// //                 {[1, 2, 3, 4, 5].map((i) => (
// //                   <div
// //                     key={i}
// //                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[3px] border-background overflow-hidden ring-2 ring-background/50"
// //                     style={{
// //                       boxShadow: "0 4px 15px oklch(0 0 0 / 0.1)",
// //                       transform: `rotate(${(i - 3) * 3}deg)`,
// //                     }}
// //                   >
// //                     <img
// //                       src={`/professional-headshot-person.png?height=44&width=44&query=professional headshot person ${i}`}
// //                       alt=""
// //                       className="w-full h-full object-cover"
// //                     />
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="text-center sm:text-left">
// //                 <div className="flex items-center justify-center sm:justify-start gap-1">
// //                   {[1, 2, 3, 4, 5].map((i) => (
// //                     <svg key={i} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 20 20">
// //                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
// //                     </svg>
// //                   ))}
// //                 </div>
// //                 <p className="text-sm text-muted-foreground">
// //                   <span className="font-semibold">4.9/5</span> from 2,000+ reviews
// //                 </p>
// //               </div>
// //             </div> */}


// //           </div>
// //         </div>

// //         {/* === PHASE 2: FINAL CTA === */}
// //         <div
// //           className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 sm:px-6"
// //           style={{
// //             opacity: finalOpacity,
// //             transform: `scale(${finalScale}) translateY(${finalY}px)`,
// //           }}
// //         >
// //           <div className="w-full max-w-4xl mx-auto pointer-events-auto text-center">


// //             {/* Main CTA Heading */}
// //             <h2
// //               className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 text-balance tracking-tight transition-all duration-700"
// //               style={{
// //                 opacity: Math.max(0, (phase2Progress - 0.15) * 2),
// //                 transform: `translateY(${30 - Math.max(0, (phase2Progress - 0.15) * 2) * 30}px)`,
// //               }}
// //             >
// //               Ready to transform
// //               <br />
// //               <span className="relative inline-block">
// //                 your outreach?
// //                 <svg
// //                   className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-4"
// //                   viewBox="0 0 200 12"
// //                   preserveAspectRatio="none"
// //                   fill="none"
// //                 >
// //                   <path
// //                     d="M3 9 Q 50 3, 100 8 T 197 6"
// //                     stroke="currentColor"
// //                     strokeWidth="3"
// //                     strokeLinecap="round"
// //                     fill="none"
// //                     className="text-foreground"
// //                   />
// //                 </svg>
// //               </span>
// //             </h2>

// //             <p
// //               className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto transition-all duration-700 px-2"
// //               style={{
// //                 opacity: Math.max(0, (phase2Progress - 0.25) * 2),
// //                 transform: `translateY(${25 - Math.max(0, (phase2Progress - 0.25) * 2) * 25}px)`,
// //               }}
// //             >
// //               Join thousands of teams already using mailfra to close more deals, faster.
// //             </p>

// //             {/* CTA Buttons */}
// //             <div
// //               className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 px-4"
// //               style={{
// //                 opacity: Math.max(0, (phase2Progress - 0.35) * 2),
// //                 transform: `translateY(${20 - Math.max(0, (phase2Progress - 0.35) * 2) * 20}px)`,
// //               }}
// //             >
// //               <Link href="/dashboard" className="w-full sm:w-auto">
// //                 <Button
// //                   size="lg"
// //                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-10 sm:px-14 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-1 group"
// //                   style={{
// //                     boxShadow: isDark ? "0 20px 50px oklch(1 0 0 / 0.15)" : "0 20px 50px oklch(0.12 0.005 285 / 0.2)",
// //                   }}
// //                 >
// //                   Start Your Free Trial
// //                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
// //                 </Button>
// //               </Link>
// //               <Link href="/dashboard" className="w-full sm:w-auto">
// //                 <Button
// //                   size="lg"
// //                   variant="ghost"
// //                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 text-muted-foreground rounded-full transition-all duration-300 hover:-translate-y-1"
// //                   style={{
// //                     background: isDark
// //                       ? "linear-gradient(135deg, oklch(0.18 0.006 285 / 0.8), oklch(0.16 0.006 285 / 0.6))"
// //                       : "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.9), oklch(0.98 0.002 90 / 0.7))",
// //                     boxShadow: isDark ? "0 15px 40px oklch(0 0 0 / 0.2)" : "0 15px 40px oklch(0.12 0.005 285 / 0.04)",
// //                     backdropFilter: "blur(16px)",
// //                     border: isDark ? "1px solid oklch(1 0 0 / 0.08)" : "1px solid oklch(0.12 0.005 285 / 0.05)",
// //                   }}
// //                 >
// //                   Talk to Sales
// //                 </Button>
// //               </Link>
// //             </div>

// //             {/* Trust Badges */}
// //             <div
// //               className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 transition-all duration-700"
// //               style={{
// //                 opacity: Math.max(0, (phase2Progress - 0.5) * 2),
// //                 transform: `translateY(${15 - Math.max(0, (phase2Progress - 0.5) * 2) * 15}px)`,
// //               }}
// //             >
// //               {["SOC 2 Certified", "GDPR Compliant", "99.9% Uptime", "24/7 Support"].map((badge, i) => (
// //                 <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
// //                   <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
// //                   <span className="text-xs sm:text-sm font-medium">{badge}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   )
// // }

// "use client"

// import { Button } from "@/components/ui/button"
// import { ArrowRight, Play, Menu, X, Zap, Globe, Shield, Check, Mail, Code2, Rocket, Lock, BarChart3, Brain, Workflow, Users, BookOpen, MessageSquare, Headphones } from "lucide-react"
// import Link from "next/link"
// import { useEffect, useState, useRef } from "react"
// import Image from "next/image"
// import { MegaMenu } from "@/components/mega-menu/mega-menu"

// const megaMenus = [
//   {
//     label: "Platform",
//     sections: [
//       {
//         title: "Dashboard Features",
//         items: [
//           {
//             icon: <Mail className="w-5 h-5" />,
//             title: "Campaigns",
//             description: "Create and manage cold email campaigns",
//             href: "/dashboard/campaigns",
//             previewImage: "/images/megamenu/campaigns.jpg",
//             previewTitle: "Campaign Management",
//             previewDescription: "Create powerful cold email campaigns with A/B testing, smart scheduling, and real-time performance tracking. Launch sequences that convert with our intuitive campaign builder."
//           },
//           {
//             icon: <BarChart3 className="w-5 h-5" />,
//             title: "Analytics",
//             description: "Real-time campaign performance tracking",
//             href: "/dashboard/analytics",
//             previewImage: "/images/megamenu/analytics.jpg",
//             previewTitle: "Advanced Analytics Dashboard",
//             previewDescription: "Track opens, clicks, replies, and conversions in real-time. Get actionable insights with detailed reports and visualizations to optimize your outreach strategy."
//           },
//           {
//             icon: <Users className="w-5 h-5" />,
//             title: "Prospects & CRM",
//             description: "Manage leads and customer relationships",
//             href: "/dashboard/prospects",
//             previewImage: "/images/megamenu/prospects.jpg",
//             previewTitle: "Prospect Management",
//             previewDescription: "Import, organize, and segment your leads with our built-in CRM. Track interactions, manage pipelines, and never miss a follow-up opportunity."
//           },
//           {
//             icon: <Workflow className="w-5 h-5" />,
//             title: "Sequences",
//             description: "Build automated follow-up sequences",
//             href: "/dashboard/sequences",
//             previewImage: "/images/megamenu/sequences.jpg",
//             previewTitle: "Email Sequence Builder",
//             previewDescription: "Design multi-step email sequences with conditional logic. Automate follow-ups based on prospect behavior and maximize your response rates."
//           },
//         ],
//         preview: {
//           title: "Dashboard Features",
//           description: "Access your complete cold email toolkit.",
//           cta: { label: "Go to Dashboard", href: "/dashboard" },
//         },
//       },
//       {
//         title: "Deliverability",
//         items: [
//           {
//             icon: <Zap className="w-5 h-5" />,
//             title: "Email Warmup",
//             description: "Maximize inbox placement & deliverability",
//             href: "/dashboard/warmup",
//             previewImage: "/images/megamenu/warmup.jpg",
//             previewTitle: "Email Warmup Engine",
//             previewDescription: "Automatically warm up your email accounts with our intelligent warmup network. Improve sender reputation and ensure your emails land in the primary inbox."
//           },
//           {
//             icon: <Brain className="w-5 h-5" />,
//             title: "AI Generation",
//             description: "AI-powered email writing and prediction",
//             href: "/dashboard/generate",
//             previewImage: "/images/megamenu/ai-tools.jpg",
//             previewTitle: "AI-Powered Email Generation",
//             previewDescription: "Generate personalized email copies, subject lines, and entire sequences with AI. Our models are trained on millions of successful cold emails."
//           },
//           {
//             icon: <BookOpen className="w-5 h-5" />,
//             title: "Templates",
//             description: "Professional pre-built templates",
//             href: "/dashboard/templates",
//             previewImage: "/images/megamenu/templates.jpg",
//             previewTitle: "Email Templates Library",
//             previewDescription: "Access hundreds of proven email templates for every use case. Customize and save your own templates for quick access."
//           },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Solutions",
//     sections: [
//       {
//         title: "Compare",
//         items: [
//           {
//             icon: <Shield className="w-5 h-5" />,
//             title: "vs Instantly",
//             description: "See how we compare",
//             href: "/compare/instantly",
//             previewImage: "/images/megamenu/compare.jpg",
//             previewTitle: "Mailfra vs Instantly",
//             previewDescription: "Discover why Mailfra offers better deliverability, more powerful automation, and superior AI capabilities compared to Instantly."
//           },
//           {
//             icon: <Shield className="w-5 h-5" />,
//             title: "vs Smartlead",
//             description: "Feature comparison",
//             href: "/compare/smartlead",
//             previewImage: "/images/megamenu/compare.jpg",
//             previewTitle: "Mailfra vs Smartlead",
//             previewDescription: "Compare features, pricing, and performance. See why teams are switching from Smartlead to Mailfra."
//           },
//           {
//             icon: <Shield className="w-5 h-5" />,
//             title: "vs Lemlist",
//             description: "Detailed comparison",
//             href: "/compare/lemlist",
//             previewImage: "/images/megamenu/analytics.jpg",
//             previewTitle: "Mailfra vs Lemlist",
//             previewDescription: "A detailed look at how Mailfra's features stack up against Lemlist for cold email outreach."
//           },
//         ],
//         preview: {
//           title: "Why Choose Mailfra",
//           description: "Compare Mailfra with other platforms.",
//           cta: { label: "View Comparisons", href: "/compare" },
//         },
//       },
//       {
//         title: "Business",
//         items: [
//           {
//             icon: <Rocket className="w-5 h-5" />,
//             title: "Pricing",
//             description: "Transparent pricing for all plans",
//             href: "/pricing",
//             previewImage: "/images/megamenu/analytics.jpg",
//             previewTitle: "Simple, Transparent Pricing",
//             previewDescription: "No hidden fees. Choose the plan that fits your needs with unlimited email accounts, sequences, and team members."
//           },
//           {
//             icon: <BarChart3 className="w-5 h-5" />,
//             title: "Case Studies",
//             description: "Real results from real customers",
//             href: "/case-studies",
//             previewImage: "/images/megamenu/prospects.jpg",
//             previewTitle: "Customer Success Stories",
//             previewDescription: "See how teams like yours are using Mailfra to book more meetings, close more deals, and scale their outreach."
//           },
//           {
//             icon: <Globe className="w-5 h-5" />,
//             title: "Integrations",
//             description: "Connect your favorite tools",
//             href: "/integrations",
//             previewImage: "/images/megamenu/integrations.jpg",
//             previewTitle: "Powerful Integrations",
//             previewDescription: "Connect Mailfra with your CRM, calendar, and 50+ other tools. Sync data, automate workflows, and work smarter."
//           },
//         ],
//       },
//     ],
//   },
//   {
//     label: "Resources",
//     sections: [
//       {
//         title: "Learning",
//         items: [
//           {
//             icon: <BookOpen className="w-5 h-5" />,
//             title: "Blog",
//             description: "Latest insights and strategies",
//             href: "/blog",
//             previewImage: "/images/megamenu/prospects.jpg",
//             previewTitle: "Mailfra Blog",
//             previewDescription: "Expert tips, strategies, and insights on cold email, sales outreach, and lead generation. Updated weekly with actionable content."
//           },
//           {
//             icon: <Code2 className="w-5 h-5" />,
//             title: "Guides & Tutorials",
//             description: "Step-by-step learning resources",
//             href: "/guides",
//             previewImage: "/images/megamenu/sequences.jpg",
//             previewTitle: "Guides & Tutorials",
//             previewDescription: "From beginner to advanced, our comprehensive guides will help you master cold email and get the most out of Mailfra."
//           },
//           {
//             icon: <MessageSquare className="w-5 h-5" />,
//             title: "Help Center",
//             description: "Support and FAQ",
//             href: "/help",
//             previewImage: "/images/megamenu/analytics.jpg",
//             previewTitle: "Help Center",
//             previewDescription: "Get answers to common questions, troubleshooting guides, and step-by-step instructions for every feature."
//           },
//         ],
//         preview: {
//           title: "Learn & Grow",
//           description: "Access comprehensive guides and tutorials.",
//           cta: { label: "Browse Resources", href: "/guides" },
//         },
//       },
//       {
//         title: "Company",
//         items: [
//           {
//             icon: <Headphones className="w-5 h-5" />,
//             title: "Contact",
//             description: "Get in touch with us",
//             href: "/contact",
//             previewImage: "/images/megamenu/campaigns.jpg",
//             previewTitle: "Contact Us",
//             previewDescription: "Have questions? Our team is here to help. Reach out for sales inquiries, support, or partnership opportunities."
//           },
//           {
//             icon: <Lock className="w-5 h-5" />,
//             title: "About",
//             description: "Our mission and team",
//             href: "/about",
//             previewImage: "/images/megamenu/warmup.jpg",
//             previewTitle: "About Mailfra",
//             previewDescription: "Learn about our mission to revolutionize cold email outreach and the team making it happen."
//           },
//           {
//             icon: <Globe className="w-5 h-5" />,
//             title: "Changelog",
//             description: "Latest product updates",
//             href: "/changelog",
//             previewImage: "/images/megamenu/ai-tools.jpg",
//             previewTitle: "Product Changelog",
//             previewDescription: "Stay up to date with the latest features, improvements, and bug fixes. We ship new updates every week."
//           },
//         ],
//       },
//     ],
//   },
// ]

// export function Hero() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const [scrollProgress, setScrollProgress] = useState(0)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [showNavbar, setShowNavbar] = useState(true)
//   const [isPastHero, setIsPastHero] = useState(false)
//   const [isDark, setIsDark] = useState(false)
//   const lastScrollY = useRef(0)

//   useEffect(() => {
//     const checkDarkMode = () => {
//       setIsDark(document.documentElement.classList.contains("dark"))
//     }
//     checkDarkMode()

//     const observer = new MutationObserver(checkDarkMode)
//     observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

//     return () => observer.disconnect()
//   }, [])

//   useEffect(() => {
//     const handleScroll = () => {
//       if (!sectionRef.current) return
//       const rect = sectionRef.current.getBoundingClientRect()
//       const sectionHeight = sectionRef.current.offsetHeight
//       const viewportHeight = window.innerHeight
//       const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)))
//       setScrollProgress(progress)

//       const currentScrollY = window.scrollY
//       const heroBottom = sectionRef.current.offsetHeight
//       const pastHero = currentScrollY > heroBottom - viewportHeight

//       setIsPastHero(pastHero)

//       if (pastHero) {
//         if (currentScrollY < lastScrollY.current) {
//           setShowNavbar(true)
//         } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
//           setShowNavbar(false)
//         }
//       } else {
//         setShowNavbar(true)
//       }

//       lastScrollY.current = currentScrollY
//     }

//     window.addEventListener("scroll", handleScroll, { passive: true })
//     handleScroll()
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const phase1Progress = Math.min(1, scrollProgress * 2.5)
//   const phase2Progress = Math.max(0, Math.min(1, (scrollProgress - 0.4) * 1.8))

//   // Navbar transitions - simplified for 2 phases
//   const navTransition = Math.min(1, scrollProgress * 2)
//   const navScrolled = scrollProgress > 0.3

//   const contentOpacity = 1 - phase1Progress * 1.2
//   const contentScale = 1 - phase1Progress * 0.15
//   const contentY = phase1Progress * -80

//   const finalOpacity = phase2Progress
//   const finalScale = 0.95 + phase2Progress * 0.05
//   const finalY = 40 - phase2Progress * 40

//   return (
//     <section ref={sectionRef} className="relative min-h-[260vh]">
//       <div className="sticky top-0 h-screen overflow-hidden">
//         {/* Refined background */}
//         <div className="absolute inset-0 pointer-events-none">
//           {/* Subtle gradient overlay */}
//           <div
//             className="absolute inset-0 transition-opacity duration-1000"
//             style={{
//               background: isDark
//                 ? "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.01 280 / 0.5) 0%, transparent 70%)"
//                 : "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.96 0.005 90 / 0.8) 0%, transparent 70%)",
//               opacity: 1 - phase1Progress * 0.5,
//             }}
//           />

//           {/* Subtle grid pattern */}
//           <div
//             className="absolute inset-0"
//             style={{
//               backgroundImage: isDark
//                 ? "linear-gradient(oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px)"
//                 : "linear-gradient(oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px)",
//               backgroundSize: "80px 80px",
//               opacity: 0.5 - scrollProgress * 0.3,
//             }}
//           />

//           {/* Refined noise texture */}
//           <div
//             className="absolute inset-0"
//             style={{
//               opacity: isDark ? 0.03 : 0.02,
//               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
//             }}
//           />
//         </div>

//         {/* === REFINED GLASSMORPHIC NAVBAR === */}
//         <nav
//           className="fixed left-1/2 z-50 flex items-center justify-between transition-all duration-500 ease-out"
//           style={{
//             top: "20px",
//             width: navScrolled ? "min(92%, 900px)" : "min(95%, 1100px)",
//             height: "60px",
//             transform: `translateX(-50%) translateY(${showNavbar ? 0 : -100}px)`,
//             opacity: showNavbar ? 1 : 0,
//             borderRadius: navScrolled ? "16px" : "9999px",
//             background: isDark
//               ? navScrolled
//                 ? "linear-gradient(135deg, oklch(0.14 0.006 285 / 0.95), oklch(0.12 0.006 285 / 0.9))"
//                 : "linear-gradient(135deg, oklch(0.14 0.006 285 / 0.85), oklch(0.12 0.006 285 / 0.75))"
//               : navScrolled
//                 ? "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.98), oklch(0.99 0.002 90 / 0.95))"
//                 : "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.9), oklch(0.99 0.002 90 / 0.8))",
//             backdropFilter: `blur(${navScrolled ? 32 : 20}px) saturate(180%)`,
//             boxShadow: isDark
//               ? navScrolled
//                 ? "0 20px 50px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(1 0 0 / 0.06) inset"
//                 : "0 15px 40px oklch(0 0 0 / 0.3), 0 0 0 1px oklch(1 0 0 / 0.05) inset"
//               : navScrolled
//                 ? "0 20px 50px oklch(0.12 0.005 285 / 0.08), 0 0 0 1px oklch(1 0 0 / 0.8) inset"
//                 : "0 15px 40px oklch(0.12 0.005 285 / 0.06), 0 0 0 1px oklch(1 0 0 / 0.9) inset",
//             border: isDark ? "1px solid oklch(1 0 0 / 0.08)" : "1px solid oklch(0.12 0.005 285 / 0.06)",
//             padding: "0 20px",
//           }}
//         >
//           {/* Logo */}
//           <Link
//             href="/dashboard"
//             className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
//           >
//             <div
//               className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500"
//               style={{
//                 background: isDark
//                   ? "linear-gradient(135deg, oklch(0.96 0.003 90), oklch(0.90 0.003 90))"
//                   : "linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.20 0.005 285))",
//                 boxShadow: isDark ? "0 4px 12px oklch(0 0 0 / 0.3)" : "0 4px 12px oklch(0.12 0.005 285 / 0.2)",
//               }}
//             >
//               <Image
//                 src="/mailfra-logo.png"
//                 alt="Mailfra"
//                 width={32}
//                 height={32}
//                 className={`w-5 h-5 object-contain transition-all duration-300 ${isDark ? "brightness-0" : "brightness-0 invert"
//                   }`}
//                 priority
//               />
//             </div>
//             <span className="font-semibold text-lg tracking-tight text-foreground">mailfra</span>
//           </Link>

//           {/* Navigation Links with MegaMenu */}
//           <div className="hidden lg:flex items-center gap-0">
//             {megaMenus.map((menu) => (
//               <MegaMenu key={menu.label} label={menu.label} sections={menu.sections} />
//             ))}
//             <Link
//               href="/pricing"
//               className="relative px-4 py-2 text-sm font-semibold text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground hover:bg-primary/5"
//             >
//               Pricing
//             </Link>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex items-center gap-3">
//             <Link
//               href="/dashboard"
//               className="hidden md:block px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-300 hover:text-foreground"
//             >
//               Sign In
//             </Link>
//             <Link href="/sign-up" className="hidden sm:block">
//               <Button
//                 size="sm"
//                 className="rounded-full px-5 h-10 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
//                 style={{
//                   background: isDark
//                     ? "linear-gradient(135deg, oklch(0.96 0.003 90), oklch(0.90 0.003 90))"
//                     : "linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.20 0.005 285))",
//                   color: isDark ? "oklch(0.12 0.005 285)" : "oklch(0.96 0.003 90)",
//                   boxShadow: isDark ? "0 8px 24px oklch(1 0 0 / 0.15)" : "0 8px 24px oklch(0.12 0.005 285 / 0.25)",
//                 }}
//               >
//                 Get Started
//               </Button>
//             </Link>

//             <button
//               className="lg:hidden p-2 rounded-full transition-colors hover:bg-accent"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//           </div>
//         </nav>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="fixed inset-0 z-40 lg:hidden bg-background/98 backdrop-blur-xl overflow-y-auto">
//             <div className="flex flex-col py-6 p-4 pt-24">
//               {megaMenus.map((menu) => (
//                 <div key={menu.label} className="border-b border-border/30 last:border-0">
//                   <h3 className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40 rounded-lg mb-2">
//                     {menu.label}
//                   </h3>
//                   <div className="space-y-0.5 py-2">
//                     {menu.sections.map((section) =>
//                       section.items.map((item) => (
//                         <Link
//                           key={item.title}
//                           href={item.href}
//                           onClick={() => setMobileMenuOpen(false)}
//                           className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-start gap-3 active:bg-primary/10 block"
//                         >
//                           <div className="text-primary mt-0.5 flex-shrink-0">
//                             {item.icon}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="font-medium leading-tight">{item.title}</div>
//                             {item.description && (
//                               <div className="text-xs text-muted-foreground mt-1 leading-snug">
//                                 {item.description}
//                               </div>
//                             )}
//                           </div>
//                         </Link>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Pricing Link */}
//               <div className="border-b border-border/30 py-2 mt-4">
//                 <h3 className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-background/40 rounded-lg mb-2">
//                   Quick Links
//                 </h3>
//                 <Link
//                   href="/pricing"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 block"
//                 >
//                   Pricing
//                 </Link>
//               </div>

//               {/* CTA Section */}
//               <div className="px-2 py-6 space-y-3 bg-gradient-to-b from-primary/5 to-transparent mt-4 rounded-lg">
//                 <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
//                   <Button
//                     size="lg"
//                     className="w-full rounded-full px-8 h-12 text-base font-medium"
//                   >
//                     Get Started
//                     <ArrowRight className="ml-2 w-5 h-5" />
//                   </Button>
//                 </Link>
//                 <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="w-full rounded-full px-8 h-12 text-base font-medium bg-transparent"
//                   >
//                     Sign In
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* === PHASE 1: HERO CONTENT === */}
//         <div
//           className="absolute inset-0 flex items-center justify-center pointer-events-none"
//           style={{
//             opacity: contentOpacity,
//             transform: `scale(${contentScale}) translateY(${contentY}px)`,
//           }}
//         >
//           <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center pointer-events-auto pt-16">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.05] mb-6 sm:mb-8 text-balance tracking-tight">
//               Generate leads in{" "}
//               <span className="relative inline-block">
//                 <span className="relative z-10">14 days</span>
//                 <svg
//                   className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-4 sm:h-6"
//                   viewBox="0 0 200 20"
//                   preserveAspectRatio="none"
//                   fill="none"
//                 >
//                   <path
//                     d="M2 15 Q 15 5, 30 12 T 60 10 T 90 14 T 120 9 T 150 13 T 180 10 T 198 12"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                     strokeLinecap="round"
//                     fill="none"
//                     className="opacity-15"
//                   />
//                   <path
//                     d="M5 13 Q 25 8, 50 14 T 100 10 T 150 15 T 195 11"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     strokeLinecap="round"
//                     fill="none"
//                   />
//                 </svg>
//               </span>
//               <br />
//               <span className="text-muted-foreground/40">free to start</span>
//             </h1>

//             <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
//               From lead discovery to email delivery. AI-powered personalization meets deliverability monitoring.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
//               <Link href="/dashboard" className="w-full sm:w-auto">
//                 <Button
//                   size="lg"
//                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-12 rounded-full transition-all duration-300 hover:-translate-y-1 group"
//                 >
//                   Start Free Trial
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 rounded-full transition-all duration-300 hover:-translate-y-1 group backdrop-blur-sm bg-transparent"
//               >
//                 <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
//                 Watch Demo
//               </Button>
//             </div>

//             {/* Social Proof */}
//             {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//               <div className="flex -space-x-3">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div
//                     key={i}
//                     className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-[3px] border-background overflow-hidden ring-2 ring-background/50"
//                     style={{
//                       boxShadow: "0 4px 15px oklch(0 0 0 / 0.1)",
//                       transform: `rotate(${(i - 3) * 3}deg)`,
//                     }}
//                   >
//                     <img
//                       src={`/professional-headshot-person.png?height=44&width=44&query=professional headshot person ${i}`}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div className="text-center sm:text-left">
//                 <div className="flex items-center justify-center sm:justify-start gap-1">
//                   {[1, 2, 3, 4, 5].map((i) => (
//                     <svg key={i} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 20 20">
//                       <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   <span className="font-semibold">4.9/5</span> from 2,000+ reviews
//                 </p>
//               </div>
//             </div> */}


//           </div>
//         </div>

//         {/* === PHASE 2: FINAL CTA === */}
//         <div
//           className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 sm:px-6"
//           style={{
//             opacity: finalOpacity,
//             transform: `scale(${finalScale}) translateY(${finalY}px)`,
//           }}
//         >
//           <div className="w-full max-w-4xl mx-auto pointer-events-auto text-center">


//             {/* Main CTA Heading */}
//             <h2
//               className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 text-balance tracking-tight transition-all duration-700"
//               style={{
//                 opacity: Math.max(0, (phase2Progress - 0.15) * 2),
//                 transform: `translateY(${30 - Math.max(0, (phase2Progress - 0.15) * 2) * 30}px)`,
//               }}
//             >
//               Ready to transform
//               <br />
//               <span className="relative inline-block">
//                 your outreach?
//                 <svg
//                   className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 sm:h-4"
//                   viewBox="0 0 200 12"
//                   preserveAspectRatio="none"
//                   fill="none"
//                 >
//                   <path
//                     d="M3 9 Q 50 3, 100 8 T 197 6"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                     strokeLinecap="round"
//                     fill="none"
//                     className="text-foreground"
//                   />
//                 </svg>
//               </span>
//             </h2>

//             <p
//               className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto transition-all duration-700 px-2"
//               style={{
//                 opacity: Math.max(0, (phase2Progress - 0.25) * 2),
//                 transform: `translateY(${25 - Math.max(0, (phase2Progress - 0.25) * 2) * 25}px)`,
//               }}
//             >
//               Join thousands of teams already using mailfra to close more deals, faster.
//             </p>

//             {/* CTA Buttons */}
//             <div
//               className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 px-4"
//               style={{
//                 opacity: Math.max(0, (phase2Progress - 0.35) * 2),
//                 transform: `translateY(${20 - Math.max(0, (phase2Progress - 0.35) * 2) * 20}px)`,
//               }}
//             >
//               <Link href="/dashboard" className="w-full sm:w-auto">
//                 <Button
//                   size="lg"
//                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-10 sm:px-14 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-1 group"
//                   style={{
//                     boxShadow: isDark ? "0 20px 50px oklch(1 0 0 / 0.15)" : "0 20px 50px oklch(0.12 0.005 285 / 0.2)",
//                   }}
//                 >
//                   Start Your Free Trial
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//               <Link href="/dashboard" className="w-full sm:w-auto">
//                 <Button
//                   size="lg"
//                   variant="ghost"
//                   className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 text-muted-foreground rounded-full transition-all duration-300 hover:-translate-y-1"
//                   style={{
//                     background: isDark
//                       ? "linear-gradient(135deg, oklch(0.18 0.006 285 / 0.8), oklch(0.16 0.006 285 / 0.6))"
//                       : "linear-gradient(135deg, oklch(0.995 0.002 90 / 0.9), oklch(0.98 0.002 90 / 0.7))",
//                     boxShadow: isDark ? "0 15px 40px oklch(0 0 0 / 0.2)" : "0 15px 40px oklch(0.12 0.005 285 / 0.04)",
//                     backdropFilter: "blur(16px)",
//                     border: isDark ? "1px solid oklch(1 0 0 / 0.08)" : "1px solid oklch(0.12 0.005 285 / 0.05)",
//                   }}
//                 >
//                   Talk to Sales
//                 </Button>
//               </Link>
//             </div>

//             {/* Trust Badges */}
//             <div
//               className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 transition-all duration-700"
//               style={{
//                 opacity: Math.max(0, (phase2Progress - 0.5) * 2),
//                 transform: `translateY(${15 - Math.max(0, (phase2Progress - 0.5) * 2) * 15}px)`,
//               }}
//             >
//               {["SOC 2 Certified", "GDPR Compliant", "99.9% Uptime", "24/7 Support"].map((badge, i) => (
//                 <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
//                   <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                   <span className="text-xs sm:text-sm font-medium">{badge}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Refined background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.18 0.01 280 / 0.5) 0%, transparent 70%)"
              : "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.96 0.005 90 / 0.8) 0%, transparent 70%)",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.20 0.006 285 / 0.3) 1px, transparent 1px)"
              : "linear-gradient(oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.88 0.003 90 / 0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            opacity: 0.5,
          }}
        />

        {/* Refined noise texture */}
        <div
          className="absolute inset-0"
          style={{
            opacity: isDark ? 0.03 : 0.02,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Hero Content - Centered */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center pt-24 sm:pt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.05] mb-6 sm:mb-8 text-balance tracking-tight">
            Generate leads in{" "}
            <span className="relative inline-block">
              <span className="relative z-10">14 days</span>
              <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-4 sm:h-6"
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M2 15 Q 15 5, 30 12 T 60 10 T 90 14 T 120 9 T 150 13 T 180 10 T 198 12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  className="opacity-15"
                />
                <path
                  d="M5 13 Q 25 8, 50 14 T 100 10 T 150 15 T 195 11"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            <br />
            <span className="text-muted-foreground/40">free to start</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
            From lead discovery to email delivery. AI-powered personalization meets deliverability monitoring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-12 rounded-full transition-all duration-300 hover:-translate-y-1 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 rounded-full transition-all duration-300 hover:-translate-y-1 group backdrop-blur-sm bg-transparent"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
