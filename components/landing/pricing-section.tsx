// import { Check } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { PRICING_PLANS } from "@/lib/constants"
// import Link from "next/link"

// export function PricingSection() {
//   return (
//     //comment
//     <section id="pricing" className="py-20 md:py-32">
//       <div className="container">
//         <div className="mx-auto max-w-2xl text-center mb-16">
//           <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
//             Simple, Transparent{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pricing</span>
//           </h2>
//           <p className="text-lg text-muted-foreground text-balance">
//             Start free, upgrade as you grow. No hidden fees, cancel anytime.
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {PRICING_PLANS.map((plan) => (
//             <Card
//               key={plan.tier}
//               className={`relative flex flex-col ${
//                 plan.popular ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-border/50"
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                   <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-xs font-semibold text-white">
//                     Most Popular
//                   </span>
//                 </div>
//               )}

//               <CardHeader>
//                 <CardTitle className="text-2xl">{plan.name}</CardTitle>
//                 <CardDescription>
//                   <span className="text-3xl font-bold text-foreground">${plan.price}</span>
//                   <span className="text-muted-foreground">/{plan.interval}</span>
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="flex-1">
//                 <ul className="space-y-3">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="flex items-start gap-2">
//                       <Check className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
//                       <span className="text-sm text-muted-foreground">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>

//               <CardFooter>
//                 <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
//                   <Link href="/sign-up">{plan.price === 0 ? "Start Free" : "Get Started"}</Link>
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         <p className="mt-8 text-center text-sm text-muted-foreground">
//           All plans include email tracking, templates, and analytics. Upgrade or downgrade anytime.
//         </p>
//       </div>
//     </section>
//   )
// }
"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PRICING_PLANS } from "@/lib/constants"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="pricing" className="py-20 md:py-32" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Start free, upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative flex flex-col h-full transition-all hover:shadow-xl ${
                  plan.popular
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                    : "border-border/50 hover:shadow-blue-500/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <Check className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full shadow-md hover:shadow-lg transition-all"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/sign-up">{plan.price === 0 ? "Start Free" : "Get Started"}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          All plans include email tracking, templates, and analytics. Upgrade or downgrade anytime.
        </motion.p>
      </div>
    </section>
  )
}
