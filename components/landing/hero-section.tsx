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

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Target, Play } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function HeroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
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
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Cold Email Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Write Cold Emails That{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Actually Get Replies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg text-muted-foreground text-balance md:text-xl leading-relaxed"
          >
            ReachAI uses advanced AI to research your prospects, craft hyper-personalized emails, and automate your
            outreach—so you can focus on closing deals, not writing emails.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              asChild
            >
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 shadow-md hover:shadow-lg transition-all bg-transparent"
              onClick={() => setIsVideoOpen(true)}
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-col items-center gap-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-cyan-400 shadow-md"
                  />
                ))}
              </div>
              <span>Join 10,000+ sales professionals</span>
            </div>
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="flex items-center gap-1"
              >
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>3x Reply Rates</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="flex items-center gap-1"
              >
                <Target className="h-4 w-4 text-green-500" />
                <span>10x Faster Outreach</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 shadow-2xl shadow-blue-500/10"
        >
          <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 dark:from-blue-950 dark:via-cyan-950 dark:to-blue-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
