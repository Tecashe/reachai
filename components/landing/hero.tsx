// "use client"

// import { Button } from "@/components/ui/button"
// import { ArrowRight, Sparkles } from "lucide-react"
// import Link from "next/link"

// export function Hero() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="morph-shape morph-shape-1"></div>
//         <div className="morph-shape morph-shape-2"></div>
//         <div className="morph-shape morph-shape-3"></div>
//         <div className="morph-shape morph-shape-4"></div>
//       </div>

//       <div className="absolute inset-0 bg-[url('/abstract-dotted-pattern.png')] opacity-[0.03] bg-repeat" />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="space-y-8">
//             {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
//               <Sparkles className="w-4 h-4 text-primary" />
//               <span>AI-Powered Email Outreach Platform</span>
//             </div> */}

//             <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] text-balance">
//               Generate leads in{" "}
//               <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
//                 14 days
//               </span>{" "}
//               free to start
//             </h1>

//             <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
//               From lead discovery to email delivery. mailfra automates your entire outreach workflow with AI-powered
//               personalization and deliverability monitoring.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link href="/dashboard">
//                 <Button
//                   size="lg"
//                   className="text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/25 group"
//                 >
//                   Start My 14 Days Free Trial
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </Button>
//               </Link>
//               <Link href="/dashboard">
//                 <Button size="lg" variant="outline" className="text-lg h-14 px-8 glass hover:bg-muted bg-transparent">
//                   Watch Demo
//                 </Button>
//               </Link>
//             </div>

//             <div className="flex items-center gap-6 pt-4">
//               <div className="flex -space-x-3">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="w-10 h-10 rounded-full glass border-2 border-background overflow-hidden">
//                     <img
//                       src={`/professional-person.png?height=40&width=40&query=professional+person+${i}`}
//                       alt={`User ${i}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">10,000+ businesses</p>
//                 <p className="text-xs text-muted-foreground">Trusted by growth teams worldwide</p>
//               </div>
//             </div>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2rem] blur-3xl" />
//             <div className="relative glass-strong rounded-[2rem] p-8 space-y-6">
//               <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
//                 <img src="/modern-email-dashboard-interface.jpg" alt="mailfra Dashboard" className="w-full h-full object-cover" />
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div className="glass rounded-2xl p-4 text-center">
//                   <div className="text-2xl font-bold text-primary">98%</div>
//                   <div className="text-xs text-muted-foreground">Deliverability</div>
//                 </div>
//                 <div className="glass rounded-2xl p-4 text-center">
//                   <div className="text-2xl font-bold text-primary">5x</div>
//                   <div className="text-xs text-muted-foreground">Response Rate</div>
//                 </div>
//                 <div className="glass rounded-2xl p-4 text-center">
//                   <div className="text-2xl font-bold text-primary">50K+</div>
//                   <div className="text-xs text-muted-foreground">Emails/Day</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Play, Menu, X, Users, BarChart3, Mail, Check, Zap, Globe, Shield } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      const viewportHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / (sectionHeight - viewportHeight)))
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const phase1Progress = Math.min(1, scrollProgress * 3) // Hero content fade
  const phase2Progress = Math.max(0, Math.min(1, (scrollProgress - 0.25) * 3)) // Bento grid
  const phase3Progress = Math.max(0, Math.min(1, (scrollProgress - 0.6) * 2.5)) // Final CTA

  const navPhase = scrollProgress < 0.33 ? 1 : scrollProgress < 0.66 ? 2 : 3
  const navTransition1 = Math.min(1, scrollProgress * 3)
  const navTransition2 = Math.max(0, Math.min(1, (scrollProgress - 0.33) * 3))
  const navTransition3 = Math.max(0, Math.min(1, (scrollProgress - 0.66) * 3))

  const navWidth =
    navPhase === 1 ? 90 + navTransition1 * 10 : navPhase === 2 ? 100 - navTransition2 * 30 : 70 + navTransition3 * 10
  const navHeight =
    navPhase === 1 ? 56 + navTransition1 * 16 : navPhase === 2 ? 72 - navTransition2 * 8 : 64 + navTransition3 * 8
  const navBorderRadius =
    navPhase === 1 ? 9999 - navTransition1 * 9960 : navPhase === 2 ? 39 + navTransition2 * 9960 : 9999
  const navY = navPhase === 3 ? 8 + navTransition3 * 12 : navTransition1 * 8
  const navBlur = 20 + scrollProgress * 30
  const navGlow = navPhase === 3 ? navTransition3 * 0.3 : 0

  // Logo transforms
  const logoRotate = navTransition1 * 360 + navTransition2 * 360 + navTransition3 * 720
  const logoScale = navPhase === 3 ? 1 + navTransition3 * 0.2 : 1 + navTransition1 * 0.1

  const contentOpacity = 1 - phase1Progress * 1.2
  const contentScale = 1 - phase1Progress * 0.25
  const contentY = phase1Progress * -120
  const contentRotateX = phase1Progress * 12

  const bentoOpacity = phase2Progress * (1 - phase3Progress * 1.5)
  const bentoScale = 0.85 + phase2Progress * 0.15 - phase3Progress * 0.15
  const bentoY = 80 - phase2Progress * 80 - phase3Progress * 100
  const bentoRotateX = 8 - phase2Progress * 8 + phase3Progress * 10

  const finalOpacity = phase3Progress
  const finalScale = 0.9 + phase3Progress * 0.1
  const finalY = 60 - phase3Progress * 60

  // Card stagger for bento
  const cardProgress = (index: number) => Math.max(0, Math.min(1, (phase2Progress - index * 0.08) * 2))

  return (
    <section ref={sectionRef} className="relative min-h-[380vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* === TRANSFORMING NAVBAR === */}
        <nav
          className="fixed left-1/2 z-50 flex items-center justify-between transition-all duration-700 ease-out"
          style={{
            top: "32px",
            width: `calc(${navWidth}% - 48px)`,
            maxWidth: navPhase === 1 && navTransition1 < 0.5 ? "1000px" : navPhase === 3 ? "800px" : "100%",
            height: `${navHeight}px`,
            transform: `translateX(-50%) translateY(${navY}px)`,
            borderRadius: `${navBorderRadius}px`,
            background:
              navPhase === 3
                ? `linear-gradient(135deg, rgba(17,17,17,${0.9 + navTransition3 * 0.1}), rgba(30,30,30,${0.85 + navTransition3 * 0.15}))`
                : `linear-gradient(135deg, rgba(255,255,255,${0.85 + navTransition1 * 0.15}), rgba(250,250,252,${0.7 + navTransition1 * 0.3}))`,
            backdropFilter: `blur(${navBlur}px) saturate(180%)`,
            boxShadow:
              navPhase === 3
                ? `
                0 0 ${60 * navGlow}px rgba(255,255,255,${navGlow * 0.2}),
                0 0 ${120 * navGlow}px rgba(200,200,255,${navGlow * 0.1}),
                0 25px 50px rgba(0,0,0,0.4),
                inset 0 1px 0 rgba(255,255,255,0.15)
              `
                : `
                0 ${20 + navTransition1 * 20}px ${40 + navTransition1 * 40}px rgba(0,0,0,${0.08 + navTransition1 * 0.07}),
                inset 0 1px 0 rgba(255,255,255,1),
                inset 0 -1px 0 rgba(0,0,0,0.03)
              `,
            border:
              navPhase === 3
                ? `1px solid rgba(255,255,255,${0.1 + navTransition3 * 0.1})`
                : `1px solid rgba(255,255,255,${0.8 - navTransition1 * 0.3})`,
            padding: `0 ${16 + navTransition1 * 16}px`,
          }}
        >
          {/* Logo with multi-spin animation */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 transition-all duration-700"
            style={{ transform: `scale(${logoScale})` }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-700"
              style={{
                background:
                  navPhase === 3
                    ? "linear-gradient(135deg, #fff 0%, #e0e0e0 100%)"
                    : "linear-gradient(135deg, #111 0%, #333 100%)",
                boxShadow:
                  navPhase === 3
                    ? `0 0 20px rgba(255,255,255,${navTransition3 * 0.5}), 0 8px 20px rgba(0,0,0,0.3)`
                    : `0 8px 20px rgba(0,0,0,${0.2 + navTransition1 * 0.15})`,
                transform: `rotate(${logoRotate}deg)`,
              }}
            >
              <Mail
                className={`w-4 h-4 transition-colors duration-500 ${navPhase === 3 ? "text-gray-900" : "text-white"}`}
              />
            </div>
            <span
              className={`font-semibold text-lg tracking-tight transition-colors duration-500 ${navPhase === 3 ? "text-white" : "text-gray-900"}`}
            >
              mailfra
            </span>
          </Link>

          {/* Nav links */}
          <div
            className="hidden md:flex items-center transition-all duration-700"
            style={{
              gap: `${4 + navTransition1 * 20 - navTransition2 * 10}px`,
              opacity: navPhase === 3 ? 1 - navTransition3 * 0.3 : 1,
            }}
          >
            {["Features", "Pricing", "Customers", "Resources"].map((item, i) => (
              <Link
                key={item}
                href="/dashboard"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-500 ${
                  navPhase === 3
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                style={{
                  transform: `translateX(${(i - 1.5) * navTransition1 * 15}px)`,
                }}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 pr-1">
            <Link
              href="/dashboard"
              className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                navPhase === 3 ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className={`rounded-full px-6 h-10 text-sm font-medium transition-all duration-500 ${
                  navPhase === 3
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
                style={{
                  boxShadow:
                    navPhase === 3
                      ? `0 0 30px rgba(255,255,255,${navTransition3 * 0.3}), 0 10px 25px rgba(0,0,0,0.2)`
                      : `0 ${10 + navTransition1 * 10}px ${25 + navTransition1 * 15}px rgba(0,0,0,${0.2 + navTransition1 * 0.1})`,
                }}
              >
                {navPhase === 3 ? "Launch App" : "Get Started"}
              </Button>
            </Link>

            <button
              className={`md:hidden p-2 rounded-full transition-colors ${
                navPhase === 3 ? "text-white/70 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Shimmer effect */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
            style={{
              borderRadius: `${navBorderRadius}px`,
              opacity:
                (scrollProgress > 0.1 && scrollProgress < 0.4) || (scrollProgress > 0.55 && scrollProgress < 0.75)
                  ? 1
                  : 0,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  navPhase === 3
                    ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
                transform: `translateX(${-100 + ((scrollProgress * 3) % 1) * 300}%)`,
                filter: "blur(20px)",
              }}
            />
          </div>
        </nav>

        {/* === LIQUID GLASS BACKGROUND ORBS === */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000"
          style={{
            opacity: (1 - phase1Progress * 0.5) * (1 - phase3Progress * 0.8),
            transform: `scale(${1 + scrollProgress * 0.2})`,
          }}
        >
          <div
            className="absolute -top-32 right-1/4 w-[600px] h-[600px]"
            style={{
              background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.95), rgba(245,247,255,0.1))",
              borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
              boxShadow: "inset 0 0 100px rgba(255,255,255,0.9), 0 0 80px rgba(200,200,230,0.15)",
              backdropFilter: "blur(40px)",
              animation: "morph1 20s ease-in-out infinite, float1 15s ease-in-out infinite",
            }}
          />
          <div
            className="absolute top-1/2 -left-48 w-[450px] h-[450px]"
            style={{
              background: "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.9), rgba(240,242,255,0.1))",
              borderRadius: "50% 60% 40% 50% / 40% 50% 60% 50%",
              boxShadow: "inset 0 0 80px rgba(255,255,255,0.8), 0 0 60px rgba(180,185,220,0.1)",
              backdropFilter: "blur(30px)",
              animation: "morph2 25s ease-in-out infinite, float2 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-20 right-16 w-[320px] h-[320px]"
            style={{
              background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,1), rgba(248,249,255,0.1))",
              borderRadius: "40% 60% 50% 50% / 60% 40% 50% 50%",
              boxShadow: "inset 0 0 60px rgba(255,255,255,0.95), 0 0 50px rgba(210,215,240,0.15)",
              backdropFilter: "blur(25px)",
              animation: "morph3 18s ease-in-out infinite, float3 12s ease-in-out infinite",
            }}
          />
        </div>

        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* === PHASE 1: INITIAL HERO CONTENT === */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: contentOpacity,
            transform: `
              scale(${contentScale}) 
              translateY(${contentY}px) 
              perspective(1000px) 
              rotateX(${contentRotateX}deg)
            `,
            transformOrigin: "center top",
          }}
        >
          <div className="max-w-5xl mx-auto px-6 text-center pointer-events-auto pt-20">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-900 leading-[1.05] mb-8 text-balance">
              Generate leads in{" "}
              <span className="relative inline-block">
                <span className="relative z-10">14 days</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-6"
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M2 15 Q 15 5, 30 12 T 60 10 T 90 14 T 120 9 T 150 13 T 180 10 T 198 12"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    style={{ opacity: 0.1 }}
                  />
                  <path
                    d="M5 13 Q 25 8, 50 14 T 100 10 T 150 15 T 195 11"
                    stroke="url(#underline-gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#111" />
                      <stop offset="50%" stopColor="#444" />
                      <stop offset="100%" stopColor="#111" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br />
              <span className="text-gray-300">free to start</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">
              From lead discovery to email delivery. AI-powered personalization meets deliverability monitoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg h-16 px-12 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="text-lg h-16 px-10 text-gray-600 rounded-full transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-11 h-11 rounded-full border-[3px] border-white overflow-hidden"
                    style={{
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                      transform: `rotate(${(i - 3) * 3}deg)`,
                    }}
                  >
                    <img
                      src={`/professional-headshot-person.png?height=44&width=44&query=professional headshot person ${i}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-gray-900">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">4.9/5</span> from 2,000+ reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-500"
          style={{ opacity: 1 - scrollProgress * 6 }}
        >
          <span className="text-sm text-gray-400 font-medium">Scroll to explore</span>
          <div className="w-7 h-12 rounded-full border-2 border-gray-300 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-gray-400 animate-bounce" />
          </div>
        </div>

        {/* === PHASE 2: BENTO DASHBOARD INTERFACE === */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-6"
          style={{
            opacity: bentoOpacity,
            transform: `
              scale(${bentoScale}) 
              translateY(${bentoY}px)
              perspective(1200px)
              rotateX(${bentoRotateX}deg)
            `,
            transformOrigin: "center bottom",
          }}
        >
          <div className="w-full max-w-7xl mx-auto pointer-events-auto">
            <div
              className="text-center mb-12 transition-all duration-700"
              style={{
                opacity: cardProgress(0),
                transform: `translateY(${30 - cardProgress(0) * 30}px)`,
              }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-600 mb-6"
                style={{
                  background: "linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Your new workspace awaits
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 text-balance">
                Everything you need,
                <br />
                <span className="text-gray-300">beautifully organized</span>
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              {/* Large analytics card */}
              <div
                className="col-span-12 lg:col-span-8 rounded-3xl p-8 transition-all duration-700 group"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(250,250,252,0.8))",
                  boxShadow: `
                    0 40px 80px rgba(0,0,0,0.06),
                    0 20px 40px rgba(0,0,0,0.04),
                    inset 0 1px 0 rgba(255,255,255,1),
                    inset 0 -1px 0 rgba(0,0,0,0.02)
                  `,
                  border: "1px solid rgba(0,0,0,0.04)",
                  backdropFilter: "blur(40px)",
                  opacity: cardProgress(1),
                  transform: `translateY(${40 - cardProgress(1) * 40}px) translateX(${-20 + cardProgress(1) * 20}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Lead Analytics</h3>
                    <p className="text-gray-500">Real-time performance overview</p>
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-sm font-medium text-gray-900"
                    style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))" }}
                  >
                    Last 30 days
                  </div>
                </div>

                <div className="relative h-48 flex items-end justify-between gap-2 mb-6">
                  {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg transition-all duration-500 group-hover:scale-y-105"
                      style={{
                        height: `${height}%`,
                        background:
                          i === 11
                            ? "linear-gradient(180deg, #111 0%, #333 100%)"
                            : "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 100%)",
                        boxShadow: i === 11 ? "0 10px 30px rgba(0,0,0,0.15)" : "none",
                        transitionDelay: `${i * 30}ms`,
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  {[
                    { label: "Total Leads", value: "12,847", change: "+23%" },
                    { label: "Conversion", value: "8.4%", change: "+1.2%" },
                    { label: "Revenue", value: "$284K", change: "+18%" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Writer card */}
              <div
                className="col-span-12 sm:col-span-6 lg:col-span-4 rounded-3xl p-6 transition-all duration-700 group"
                style={{
                  background: "linear-gradient(145deg, #111 0%, #1a1a1a 100%)",
                  boxShadow: `
                    0 40px 80px rgba(0,0,0,0.2),
                    0 20px 40px rgba(0,0,0,0.15),
                    inset 0 1px 0 rgba(255,255,255,0.08)
                  `,
                  opacity: cardProgress(2),
                  transform: `translateY(${50 - cardProgress(2) * 50}px) translateX(${20 - cardProgress(2) * 20}px) rotate(${2 - cardProgress(2) * 2}deg)`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))" }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Email Writer</h3>
                    <p className="text-sm text-white/50">Powered by GPT-4</p>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-4 mb-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-white/70 text-sm leading-relaxed">
                    "Hi Sarah, I noticed your recent post about scaling B2B teams—loved your insights on..."
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: "75%", animation: "pulse 2s ease-in-out infinite" }}
                      />
                    </div>
                    <span className="text-xs text-white/40">Writing...</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#111] overflow-hidden">
                        <img
                          src={`/diverse-group-avatars.png?height=32&width=32&query=avatar ${i}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-white/40">+847 emails today</span>
                </div>
              </div>

              {/* Quick actions card */}
              <div
                className="col-span-12 sm:col-span-6 lg:col-span-6 rounded-3xl p-6 transition-all duration-700"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(252,252,254,0.9))",
                  boxShadow: `
                    0 30px 60px rgba(0,0,0,0.05),
                    0 15px 30px rgba(0,0,0,0.03),
                    inset 0 1px 0 rgba(255,255,255,1)
                  `,
                  border: "1px solid rgba(0,0,0,0.04)",
                  backdropFilter: "blur(30px)",
                  opacity: cardProgress(3),
                  transform: `translateY(${60 - cardProgress(3) * 60}px) rotate(${-1 + cardProgress(3) * 1}deg)`,
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: "Import contacts", count: "2.4K" },
                    { icon: Mail, label: "Send campaign", count: "Ready" },
                    { icon: BarChart3, label: "View reports", count: "New" },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-gray-50 group/btn"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))" }}
                      >
                        <action.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="flex-1 text-left text-gray-700 font-medium">{action.label}</span>
                      <span className="text-sm text-gray-400">{action.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress card */}
              <div
                className="col-span-12 sm:col-span-6 lg:col-span-6 rounded-3xl p-6 transition-all duration-700"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(250,251,254,0.85))",
                  boxShadow: `
                    0 30px 60px rgba(0,0,0,0.05),
                    0 15px 30px rgba(0,0,0,0.03),
                    inset 0 1px 0 rgba(255,255,255,1)
                  `,
                  border: "1px solid rgba(0,0,0,0.04)",
                  backdropFilter: "blur(30px)",
                  opacity: cardProgress(4),
                  transform: `translateY(${70 - cardProgress(4) * 70}px)`,
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Onboarding</h3>
                  <span className="text-sm font-medium text-gray-900">75%</span>
                </div>

                <div className="h-2 rounded-full bg-gray-100 mb-6 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: "75%", background: "linear-gradient(90deg, #111 0%, #444 100%)" }}
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Connect email", done: true },
                    { label: "Import contacts", done: true },
                    { label: "Create campaign", done: true },
                    { label: "Send first email", done: false },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          step.done ? "bg-gray-900" : "border-2 border-gray-200"
                        }`}
                      >
                        {step.done && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${step.done ? "text-gray-500 line-through" : "text-gray-700"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === PHASE 3: FINAL CTA SECTION === */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none px-6"
          style={{
            opacity: finalOpacity,
            transform: `scale(${finalScale}) translateY(${finalY}px)`,
          }}
        >
          <div className="w-full max-w-4xl mx-auto pointer-events-auto text-center">
            {/* Floating feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {[
                { icon: Zap, label: "Lightning Fast", delay: 0 },
                { icon: Globe, label: "Global Scale", delay: 0.1 },
                { icon: Shield, label: "Enterprise Security", delay: 0.2 },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-700"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(250,250,252,0.8))",
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.06),
                      0 10px 20px rgba(0,0,0,0.04),
                      inset 0 1px 0 rgba(255,255,255,1)
                    `,
                    border: "1px solid rgba(0,0,0,0.04)",
                    backdropFilter: "blur(20px)",
                    opacity: Math.max(0, (phase3Progress - badge.delay) * 2),
                    transform: `translateY(${20 - Math.max(0, (phase3Progress - badge.delay) * 2) * 20}px)`,
                  }}
                >
                  <badge.icon className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Main CTA */}
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 text-balance transition-all duration-700"
              style={{
                opacity: Math.max(0, (phase3Progress - 0.15) * 2),
                transform: `translateY(${30 - Math.max(0, (phase3Progress - 0.15) * 2) * 30}px)`,
              }}
            >
              Ready to transform
              <br />
              <span className="relative inline-block">
                your outreach?
                <svg
                  className="absolute -bottom-2 left-0 w-full h-4"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path
                    d="M3 9 Q 50 3, 100 8 T 197 6"
                    stroke="#111"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>

            <p
              className="text-xl text-gray-500 mb-10 max-w-xl mx-auto transition-all duration-700"
              style={{
                opacity: Math.max(0, (phase3Progress - 0.25) * 2),
                transform: `translateY(${25 - Math.max(0, (phase3Progress - 0.25) * 2) * 25}px)`,
              }}
            >
              Join thousands of teams already using mailfra to close more deals, faster.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700"
              style={{
                opacity: Math.max(0, (phase3Progress - 0.35) * 2),
                transform: `translateY(${20 - Math.max(0, (phase3Progress - 0.35) * 2) * 20}px)`,
              }}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-lg h-16 px-14 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
                  style={{
                    boxShadow: "0 30px 60px rgba(0,0,0,0.2), 0 15px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-lg h-16 px-10 text-gray-600 rounded-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5))",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  Talk to Sales
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 transition-all duration-700"
              style={{
                opacity: Math.max(0, (phase3Progress - 0.5) * 2),
                transform: `translateY(${15 - Math.max(0, (phase3Progress - 0.5) * 2) * 15}px)`,
              }}
            >
              {["SOC 2 Certified", "GDPR Compliant", "99.9% Uptime", "24/7 Support"].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
          25% { border-radius: 50% 60% 40% 50% / 40% 50% 60% 50%; }
          50% { border-radius: 40% 50% 60% 50% / 60% 40% 50% 60%; }
          75% { border-radius: 50% 40% 50% 60% / 50% 60% 40% 50%; }
        }
        @keyframes morph2 {
          0%, 100% { border-radius: 50% 60% 40% 50% / 40% 50% 60% 50%; }
          33% { border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%; }
          66% { border-radius: 40% 50% 60% 50% / 60% 40% 50% 60%; }
        }
        @keyframes morph3 {
          0%, 100% { border-radius: 40% 60% 50% 50% / 60% 40% 50% 50%; }
          50% { border-radius: 60% 40% 50% 60% / 40% 60% 50% 40%; }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -25px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, -35px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
