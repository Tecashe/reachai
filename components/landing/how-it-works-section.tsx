// import { Upload, Brain, Sparkles, Send } from "lucide-react"

// const steps = [
//   {
//     icon: Upload,
//     title: "Upload Your Prospects",
//     description: "Import your prospect list via CSV or connect your CRM. Add LinkedIn URLs for deeper research.",
//     step: "01",
//   },
//   {
//     icon: Brain,
//     title: "AI Does the Research",
//     description:
//       "Our AI researches each prospect—company info, recent news, pain points, and competitor tools they use.",
//     step: "02",
//   },
//   {
//     icon: Sparkles,
//     title: "Generate Personalized Emails",
//     description: "AI crafts unique, personalized emails for each prospect with relevant talking points and clear CTAs.",
//     step: "03",
//   },
//   {
//     icon: Send,
//     title: "Send & Track Results",
//     description: "Launch your campaign with smart send times, automated follow-ups, and real-time analytics.",
//     step: "04",
//   },
// ]

// export function HowItWorksSection() {
//   return (
//     <section id="how-it-works" className="py-20 md:py-32 bg-muted/30">
//       <div className="container">
//         <div className="mx-auto max-w-2xl text-center mb-16">
//           <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
//             From Prospect to Reply in{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//               4 Simple Steps
//             </span>
//           </h2>
//           <p className="text-lg text-muted-foreground text-balance">
//             Our AI-powered workflow makes cold email outreach effortless and effective.
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {steps.map((step, index) => (
//             <div key={index} className="relative">
//               {/* Connector line */}
//               {index < steps.length - 1 && (
//                 <div className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />
//               )}

//               <div className="relative">
//                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
//                   <step.icon className="h-8 w-8" />
//                 </div>
//                 <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-blue-500 text-xs font-bold text-blue-600">
//                   {step.step}
//                 </div>
//               </div>

//               <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


// "use client"

// import { Upload, Brain, Sparkles, Send } from "lucide-react"
// import { motion } from "framer-motion"
// import { useInView } from "framer-motion"
// import { useRef } from "react"

// const steps = [
//   {
//     icon: Upload,
//     title: "Upload Your Prospects",
//     description: "Import your prospect list via CSV or connect your CRM. Add LinkedIn URLs for deeper research.",
//     step: "01",
//   },
//   {
//     icon: Brain,
//     title: "AI Does the Research",
//     description:
//       "Our AI researches each prospect—company info, recent news, pain points, and competitor tools they use.",
//     step: "02",
//   },
//   {
//     icon: Sparkles,
//     title: "Generate Personalized Emails",
//     description: "AI crafts unique, personalized emails for each prospect with relevant talking points and clear CTAs.",
//     step: "03",
//   },
//   {
//     icon: Send,
//     title: "Send & Track Results",
//     description: "Launch your campaign with smart send times, automated follow-ups, and real-time analytics.",
//     step: "04",
//   },
// ]

// export function HowItWorksSection() {
//   const ref = useRef(null)
//   const isInView = useInView(ref, { once: true, margin: "-100px" })

//   return (
//     <section id="how-it-works" className="py-20 md:py-32 bg-muted/30" ref={ref}>
//       <div className="container">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
//           transition={{ duration: 0.5 }}
//           className="mx-auto max-w-2xl text-center mb-16"
//         >
//           <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
//             From Prospect to Reply in{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//               4 Simple Steps
//             </span>
//           </h2>
//           <p className="text-lg text-muted-foreground text-balance">
//             Our AI-powered workflow makes cold email outreach effortless and effective.
//           </p>
//         </motion.div>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {steps.map((step, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
//               transition={{ duration: 0.5, delay: index * 0.15 }}
//               className="relative"
//             >
//               {index < steps.length - 1 && (
//                 <motion.div
//                   initial={{ scaleX: 0 }}
//                   animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
//                   className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent origin-left"
//                 />
//               )}

//               <div className="relative">
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={isInView ? { scale: 1 } : { scale: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
//                   className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
//                 >
//                   <step.icon className="h-8 w-8" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={isInView ? { scale: 1 } : { scale: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.15 + 0.4 }}
//                   className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-blue-500 text-xs font-bold text-blue-600"
//                 >
//                   {step.step}
//                 </motion.div>
//               </div>

//               <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }


"use client"

import { Upload, Brain, Sparkles, Send } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    icon: Upload,
    title: "Upload Your Prospects",
    description: "Import your prospect list via CSV or connect your CRM. Add LinkedIn URLs for deeper research.",
    step: "01",
  },
  {
    icon: Brain,
    title: "AI Does the Research",
    description:
      "Our AI researches each prospect—company info, recent news, pain points, and competitor tools they use.",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Generate Personalized Emails",
    description: "AI crafts unique, personalized emails for each prospect with relevant talking points and clear CTAs.",
    step: "03",
  },
  {
    icon: Send,
    title: "Send & Track Results",
    description: "Launch your campaign with smart send times, automated follow-ups, and real-time analytics.",
    step: "04",
  },
]

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            From Prospect to Reply in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Our AI-powered workflow makes cold email outreach effortless and effective.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  className="hidden lg:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary/50 to-transparent origin-left"
                />
              )}

              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30"
                >
                  <step.icon className="h-8 w-8" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.15 + 0.4 }}
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-xs font-bold text-primary"
                >
                  {step.step}
                </motion.div>
              </div>

              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
