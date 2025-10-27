// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Sparkles, Zap, Target } from "lucide-react"

// export function HeroSection() {
//   return (
//     <section className="relative overflow-hidden py-20 md:py-32">
//       {/* Background gradient */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20" />

//       <div className="container">
//         <div className="mx-auto max-w-4xl text-center">
//           {/* Badge */}
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
//             <Sparkles className="h-4 w-4" />
//             AI-Powered Cold Email Platform
//           </div>

//           {/* Headline */}
//           <h1 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
//             Write Cold Emails That{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//               Actually Get Replies
//             </span>
//           </h1>

//           {/* Subheadline */}
//           <p className="mb-8 text-lg text-muted-foreground text-balance md:text-xl">
//             ReachAI uses advanced AI to research your prospects, craft hyper-personalized emails, and automate your
//             outreach—so you can focus on closing deals, not writing emails.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <Button size="lg" className="gap-2" asChild>
//               <Link href="/sign-up">
//                 Start Free Trial
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//             </Button>
//             <Button size="lg" variant="outline" asChild>
//               <Link href="#how-it-works">See How It Works</Link>
//             </Button>
//           </div>

//           {/* Social Proof */}
//           <div className="mt-12 flex flex-col items-center gap-4 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div
//                     key={i}
//                     className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-cyan-400"
//                   />
//                 ))}
//               </div>
//               <span>Join 10,000+ sales professionals</span>
//             </div>
//             <div className="flex items-center gap-6">
//               <div className="flex items-center gap-1">
//                 <Zap className="h-4 w-4 text-yellow-500" />
//                 <span>3x Reply Rates</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <Target className="h-4 w-4 text-green-500" />
//                 <span>10x Faster Outreach</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Hero Image/Demo */}
//         <div className="mt-16 rounded-xl border border-border bg-card p-2 shadow-2xl">
//           <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950" />
//         </div>
//       </div>
//     </section>
//   )
// }

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Sparkles, Zap, Target, Play } from "lucide-react"
// import { motion } from "framer-motion"
// import { useState } from "react"

// export function HeroSection() {
//   const [isVideoOpen, setIsVideoOpen] = useState(false)

//   return (
//     <section className="relative overflow-hidden py-20 md:py-32">
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20" />
//         <motion.div
//           className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
//           animate={{
//             scale: [1.2, 1, 1.2],
//             opacity: [0.5, 0.3, 0.5],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//       </div>

//       <div className="container">
//         <div className="mx-auto max-w-4xl text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 shadow-lg shadow-blue-500/20"
//           >
//             <Sparkles className="h-4 w-4" />
//             AI-Powered Cold Email Platform
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
//           >
//             Write Cold Emails That{" "}
//             <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
//               Actually Get Replies
//             </span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="mb-8 text-lg text-muted-foreground text-balance md:text-xl leading-relaxed"
//           >
//             ReachAI uses advanced AI to research your prospects, craft hyper-personalized emails, and automate your
//             outreach—so you can focus on closing deals, not writing emails.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="flex flex-col items-center justify-center gap-4 sm:flex-row"
//           >
//             <Button
//               size="lg"
//               className="gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
//               asChild
//             >
//               <Link href="/sign-up">
//                 Start Free Trial
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="gap-2 shadow-md hover:shadow-lg transition-all bg-transparent"
//               onClick={() => setIsVideoOpen(true)}
//             >
//               <Play className="h-4 w-4" />
//               Watch Demo
//             </Button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="mt-12 flex flex-col items-center gap-4 text-sm text-muted-foreground"
//           >
//             <div className="flex items-center gap-2">
//               <div className="flex -space-x-2">
//                 {[1, 2, 3, 4].map((i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
//                     className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-cyan-400 shadow-md"
//                   />
//                 ))}
//               </div>
//               <span>Join 10,000+ sales professionals</span>
//             </div>
//             <div className="flex items-center gap-6">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: 0.9 }}
//                 className="flex items-center gap-1"
//               >
//                 <Zap className="h-4 w-4 text-yellow-500" />
//                 <span>3x Reply Rates</span>
//               </motion.div>
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: 1.0 }}
//                 className="flex items-center gap-1"
//               >
//                 <Target className="h-4 w-4 text-green-500" />
//                 <span>10x Faster Outreach</span>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.5 }}
//           className="mt-16 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 shadow-2xl shadow-blue-500/10"
//         >
//           <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-950 relative overflow-hidden">
//             <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Sparkles, Zap, Target, Play, CheckCircle2, TrendingUp } from "lucide-react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { useState, useRef } from "react"

// export function HeroSection() {
//   const [isVideoOpen, setIsVideoOpen] = useState(false)
//   const ref = useRef(null)
//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ["start start", "end start"],
//   })

//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
//   const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

//   return (
//     <section ref={ref} className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-40">
//       <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-background to-background dark:from-blue-950/30" />
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
//         <motion.div
//           className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl"
//           animate={{
//             scale: [1.2, 1, 1.2],
//             opacity: [0.5, 0.3, 0.5],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//       </motion.div>

//       <div className="container px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-5xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-8 flex justify-center"
//           >
//             <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300 shadow-lg shadow-blue-500/10">
//               <Sparkles className="h-4 w-4" />
//               <span>AI-Powered Cold Email Platform</span>
//               <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
//             </div>
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="mb-6 text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
//           >
//             Write Cold Emails That{" "}
//             <span className="relative inline-block">
//               <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
//                 Actually Get Replies
//               </span>
//               <motion.div
//                 className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full"
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ duration: 0.8, delay: 0.5 }}
//               />
//             </span>
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="mb-10 text-center text-lg text-muted-foreground text-balance md:text-xl leading-relaxed max-w-3xl mx-auto"
//           >
//             ReachAI uses advanced AI to research your prospects, craft hyper-personalized emails, and automate your
//             outreach—so you can focus on closing deals, not writing emails.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12"
//           >
//             <Button
//               size="lg"
//               className="gap-2 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-105 text-base px-8 py-6"
//               asChild
//             >
//               <Link href="/sign-up">
//                 Start Free Trial
//                 <ArrowRight className="h-5 w-5" />
//               </Link>
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-background/50 backdrop-blur-sm text-base px-8 py-6"
//               onClick={() => setIsVideoOpen(true)}
//             >
//               <Play className="h-5 w-5" />
//               Watch Demo
//             </Button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="flex flex-col items-center gap-6 text-sm text-muted-foreground"
//           >
//             <div className="flex items-center gap-3">
//               <div className="flex -space-x-3">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ scale: 0, rotate: -180 }}
//                     animate={{ scale: 1, rotate: 0 }}
//                     transition={{ duration: 0.5, delay: 0.5 + i * 0.1, type: "spring" }}
//                     className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg"
//                   />
//                 ))}
//               </div>
//               <span className="font-medium">Join 10,000+ sales professionals</span>
//             </div>
//             <div className="flex flex-wrap items-center justify-center gap-6">
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: 0.9, type: "spring" }}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
//               >
//                 <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//                 <span className="font-medium text-green-700 dark:text-green-300">3x Reply Rates</span>
//               </motion.div>
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: 1.0, type: "spring" }}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900"
//               >
//                 <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
//                 <span className="font-medium text-yellow-700 dark:text-yellow-300">10x Faster Outreach</span>
//               </motion.div>
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: 1.1, type: "spring" }}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
//               >
//                 <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//                 <span className="font-medium text-blue-700 dark:text-blue-300">95% Deliverability</span>
//               </motion.div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 60 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//             className="mt-20 relative"
//           >
//             <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
//             <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 shadow-2xl shadow-blue-500/20">
//               <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-950 relative overflow-hidden">
//                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center space-y-4">
//                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg">
//                       <CheckCircle2 className="h-5 w-5 text-green-500" />
//                       <span className="font-medium">Dashboard Preview</span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">See ReachAI in action</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }


"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp, Zap, Target, CheckCircle2 } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useRef } from "react"

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={ref} className="relative overflow-hidden pt-20 pb-32 md:pt-40 md:pb-48">
      <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary shadow-lg shadow-primary/10">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Cold Email Platform</span>
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Write Cold Emails That{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Actually Get Replies
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 text-center text-lg text-muted-foreground text-balance md:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            ReachAI uses advanced AI to research your prospects, craft hyper-personalized emails, and automate your
            outreach—so you can focus on closing deals, not writing emails.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12"
          >
            <Button
              size="lg"
              className="gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105 text-base px-8 py-6"
              asChild
            >
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-background/50 backdrop-blur-sm text-base px-8 py-6"
              onClick={() => setIsVideoOpen(true)}
            >
              <Zap className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1, type: "spring" }}
                    className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-accent/60 shadow-lg"
                  />
                ))}
              </div>
              <span className="font-medium">Join 10,000+ sales professionals</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
              >
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-300">3x Reply Rates</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.0, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900"
              >
                <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">10x Faster Outreach</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.1, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900"
              >
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-700 dark:text-blue-300">95% Deliverability</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 shadow-2xl shadow-primary/20">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Dashboard Preview</span>
                    </div>
                    <p className="text-sm text-muted-foreground">See ReachAI in action</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
