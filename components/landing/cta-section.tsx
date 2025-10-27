// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight } from "lucide-react"

// export function CTASection() {
//   return (
//     <section className="py-20 md:py-32">
//       <div className="container">
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 md:p-16">
//           {/* Background pattern */}
//           <div className="absolute inset-0 bg-grid-white/10" />

//           <div className="relative mx-auto max-w-3xl text-center text-white">
//             <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
//               Ready to 10x Your Cold Email Results?
//             </h2>
//             <p className="text-lg text-blue-50 text-balance mb-8">
//               Join thousands of sales professionals who are closing more deals with AI-powered personalization.
//             </p>
//             <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
//               <Button size="lg" variant="secondary" className="gap-2" asChild>
//                 <Link href="/sign-up">
//                   Start Free Trial
//                   <ArrowRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-white/20 bg-white/10 text-white hover:bg-white/20"
//                 asChild
//               >
//                 <Link href="#pricing">View Pricing</Link>
//               </Button>
//             </div>
//             <p className="mt-6 text-sm text-blue-100">No credit card required • 100 free emails • Cancel anytime</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 md:p-16"
        >
          <div className="absolute inset-0 bg-grid-white/10" />
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4"
            >
              Ready to 10x Your Cold Email Results?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-white/90 text-balance mb-8"
            >
              Join thousands of sales professionals who are closing more deals with AI-powered personalization.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                asChild
              >
                <Link href="#pricing" className="gap-2 flex items-center">
                  <Zap className="h-4 w-4" />
                  View Pricing
                </Link>
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-sm text-white/80"
            >
              No credit card required • 100 free emails • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
