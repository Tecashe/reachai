// "use client"

// import type React from "react"

// import { Button } from "@/components/ui/button"
// import { ArrowRight, Mail } from "lucide-react"
// import Link from "next/link"
// import { useEffect, useRef, useState } from "react"

// export function CTA() {
//   const sectionRef = useRef<HTMLDivElement>(null)
//   const [isVisible, setIsVisible] = useState(false)
//   const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true)
//         }
//       },
//       { threshold: 0.3 },
//     )

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current)
//     }

//     return () => observer.disconnect()
//   }, [])

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const rect = e.currentTarget.getBoundingClientRect()
//     setMousePosition({
//       x: (e.clientX - rect.left) / rect.width,
//       y: (e.clientY - rect.top) / rect.height,
//     })
//   }

//   return (
//     <section ref={sectionRef} className="relative py-24 sm:py-32 bg-foreground overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Radial gradient following mouse */}
//         <div
//           className="absolute inset-0 opacity-30 transition-opacity duration-1000"
//           style={{
//             background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15), transparent 50%)`,
//           }}
//         />

//         {/* Floating orbs */}
//         <div
//           className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
//           style={{
//             background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
//             animation: "float1 15s ease-in-out infinite",
//           }}
//         />
//         <div
//           className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
//           style={{
//             background: "radial-gradient(circle, rgba(255,255,255,0.03), transparent 70%)",
//             animation: "float2 20s ease-in-out infinite",
//           }}
//         />

//         {/* Grid pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
//             `,
//             backgroundSize: "80px 80px",
//           }}
//         />
//       </div>

//       <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" onMouseMove={handleMouseMove}>
//         {/* Logo mark */}
//         <div
//           className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-8 transition-all duration-1000"
//           style={{
//             background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
//             opacity: isVisible ? 1 : 0,
//             transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
//           }}
//         >
//           <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-background" />
//         </div>

//         {/* Headline */}
//         <h2
//           className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 transition-all duration-1000 text-balance"
//           style={{
//             opacity: isVisible ? 1 : 0,
//             transform: isVisible ? "translateY(0)" : "translateY(30px)",
//             transitionDelay: "100ms",
//           }}
//         >
//           Ready to 10x your
//           <br />
//           outbound pipeline?
//         </h2>

//         {/* Subheadline */}
//         <p
//           className="text-lg sm:text-xl text-background/70 max-w-2xl mx-auto mb-10 transition-all duration-1000"
//           style={{
//             opacity: isVisible ? 1 : 0,
//             transform: isVisible ? "translateY(0)" : "translateY(30px)",
//             transitionDelay: "200ms",
//           }}
//         >
//           Join 10,000+ sales teams sending 50M+ emails monthly. Start your 14-day free trial today — no credit card
//           required.
//         </p>

//         {/* CTA buttons */}
//         <div
//           className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-1000"
//           style={{
//             opacity: isVisible ? 1 : 0,
//             transform: isVisible ? "translateY(0)" : "translateY(30px)",
//             transitionDelay: "300ms",
//           }}
//         >
//           <Link href="/dashboard">
//             <Button
//               size="lg"
//               className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-12 bg-background text-foreground rounded-full hover:bg-background/90 transition-all duration-300 hover:-translate-y-1 group"
//               style={{
//                 boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.1)",
//               }}
//             >
//               Start Free Trial
//               <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Button>
//           </Link>
//           <Link href="/dashboard">
//             <Button
//               size="lg"
//               variant="ghost"
//               className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 text-background/80 hover:text-background rounded-full transition-all duration-300 hover:-translate-y-1 border border-background/20 hover:border-background/40 hover:bg-background/5"
//             >
//               Book a Demo
//             </Button>
//           </Link>
//         </div>

//         {/* Trust indicators */}
//         <div
//           className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-background/60 text-sm transition-all duration-1000"
//           style={{
//             opacity: isVisible ? 1 : 0,
//             transform: isVisible ? "translateY(0)" : "translateY(20px)",
//             transitionDelay: "400ms",
//           }}
//         >
//           <span className="flex items-center gap-2">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Free 14-day trial
//           </span>
//           <span className="flex items-center gap-2">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             No credit card
//           </span>
//           <span className="flex items-center gap-2">
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             Setup in 5 minutes
//           </span>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-foreground overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient following mouse */}
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15), transparent 50%)`,
          }}
        />

        {/* Floating orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
            animation: "float1 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.03), transparent 70%)",
            animation: "float2 20s ease-in-out infinite",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center" onMouseMove={handleMouseMove}>
        {/* Logo mark */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-8 transition-all duration-1000 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          }}
        >
          <Image
            src="/logo.png"
            alt="Mailfra"
            width={80}
            height={80}
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain brightness-0 invert"
          />
        </div>

        {/* Headline */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 transition-all duration-1000 text-balance"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "100ms",
          }}
        >
          Ready to 10x your
          <br />
          outbound pipeline?
        </h2>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-background/70 max-w-2xl mx-auto mb-10 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "200ms",
          }}
        >
          Join 10,000+ sales teams sending 50M+ emails monthly. Start your 14-day free trial today — no credit card
          required.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "300ms",
          }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-12 bg-background text-foreground rounded-full hover:bg-background/90 transition-all duration-300 hover:-translate-y-1 group"
              style={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 60px rgba(255,255,255,0.1)",
              }}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 text-background/80 hover:text-background rounded-full transition-all duration-300 hover:-translate-y-1 border border-background/20 hover:border-background/40 hover:bg-background/5"
            >
              Book a Demo
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-background/60 text-sm transition-all duration-1000"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "400ms",
          }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Free 14-day trial
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            No credit card
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Setup in 5 minutes
          </span>
        </div>
      </div>
    </section>
  )
}
