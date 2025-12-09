// import { SignUp } from "@clerk/nextjs"

// export default function SignUpPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Get started</h1>
//           <p className="mt-2 text-gray-600">Create your mailfra account and start writing better emails</p>
//         </div>
//         <SignUp
//           appearance={{
//             elements: {
//               rootBox: "mx-auto",
//               card: "shadow-xl",
//             },
//           }}
//         />
//       </div>
//     </div>
//   )
// }

// import { SignUp } from "@clerk/nextjs"
// import Link from "next/link"
// import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react"

// export default function SignUpPage() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left side - Branding */}
//       <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 text-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />

//         <div className="relative z-10">
//           <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
//             <ArrowLeft className="h-5 w-5" />
//             <span className="font-medium">Back to home</span>
//           </Link>
//         </div>

//         <div className="relative z-10 space-y-8">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
//               <Sparkles className="h-7 w-7" />
//             </div>
//             <span className="text-3xl font-bold">mailfra</span>
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-4xl font-bold leading-tight">Start writing emails that get replies</h1>
//             <p className="text-lg text-blue-100">
//               Join thousands of sales professionals who are closing more deals with AI-powered personalization.
//             </p>
//           </div>

//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//               <span>100 free emails to get started</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//               <span>No credit card required</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//               <span>Cancel anytime, no questions asked</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//               <span>Full access to all features</span>
//             </div>
//             <div className="flex items-center gap-3">
//               <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//               <span>24/7 customer support</span>
//             </div>
//           </div>

//           <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
//             <p className="text-sm text-blue-100 mb-4">
//               "mailfra increased our reply rate from 8% to 24% in just two weeks. Best investment we've made this year."
//             </p>
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-full bg-white/20" />
//               <div>
//                 <p className="font-semibold text-sm">Sarah Chen</p>
//                 <p className="text-xs text-blue-100">Head of Sales, TechFlow</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 text-sm text-blue-100">© 2025 mailfra. All rights reserved.</div>
//       </div>

//       {/* Right side - Sign up form */}
//       <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
//         <div className="w-full max-w-md space-y-8">
//           <div className="lg:hidden text-center mb-8">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to home</span>
//             </Link>
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
//                 <Sparkles className="h-6 w-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold">mailfra</span>
//             </div>
//           </div>

//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold">Create your account</h1>
//             <p className="text-muted-foreground">Start your free trial today</p>
//           </div>

//           <SignUp
//             appearance={{
//               elements: {
//                 rootBox: "mx-auto",
//                 card: "shadow-xl border-border",
//                 headerTitle: "hidden",
//                 headerSubtitle: "hidden",
//               },
//             }}
//           />

//           <p className="text-center text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// import { SignUp } from "@clerk/nextjs"
// import { dark } from '@clerk/themes'
// import Link from "next/link"
// import { Sparkles, ArrowLeft } from "lucide-react"

// export default function SignUpPage() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
//       {/* Left side - Image */}
//       <div className="hidden lg:flex items-center justify-center p-12 bg-[#0a0a0a]">
//         <div className="relative w-full max-w-lg">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />
//           <img
//             src="/oauth.png"
//             alt="Sign up"
//             className="relative w-full h-auto object-contain drop-shadow-2xl"
//           />
//         </div>
//       </div>

//       {/* Right side - Sign up form */}
//       <div className="flex items-center justify-center p-6 sm:p-12 bg-[#0a0a0a]">
//         <div className="w-full max-w-md space-y-8">
//           <div className="lg:hidden text-center mb-8">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 mb-6 text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to home</span>
//             </Link>
//           </div>
//           <SignUp
//             appearance={{
//               baseTheme: dark,
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { dark } from "@clerk/themes"
import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

const headlines = [
  { main: "Send emails that convert", sub: "AI-powered personalization at scale" },
  { main: "Book more meetings", sub: "Turn cold leads into warm conversations" },
  { main: "Scale your outreach", sub: "Reach thousands without losing the personal touch" },
  { main: "Close deals faster", sub: "Smart sequences that work while you sleep" },
]

export default function SignUpPage() {
  const [headlineIndex, setHeadlineIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left side - Dark with Text Morph */}
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid-signup" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-signup)" />
          </svg>
        </div>

        {/* Gradient blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 blur-3xl rounded-full" />

        {/* Logo */}
        {/* <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#0a0a0a]" />
          </div>
          <span className="font-semibold text-xl text-white">ColdFlow</span>
        </div> */}

        {/* Morphing Text */}
        <div className="relative z-10 px-12 max-w-lg text-center h-40 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={headlineIndex}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 text-balance">
                {headlines[headlineIndex].main}
              </h1>
              <p className="text-xl text-white/50">{headlines[headlineIndex].sub}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-32 left-12 right-12">
          <div className="flex gap-3">
            {headlines.map((_, i) => (
              <div key={i} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{
                    width: i === headlineIndex ? "100%" : i < headlineIndex ? "100%" : "0%",
                  }}
                  transition={{ duration: i === headlineIndex ? 3.5 : 0, ease: "linear" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
      </div>

      {/* Right side - Light with Sign up form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white relative">

        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 text-[#a1a1aa] hover:text-[#0a0a0a] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SignUp
              appearance={{
                baseTheme: dark,
                elements: {
                  rootBox: "w-full",
                  card: "bg-white shadow-none",
                  headerTitle: "text-neutral-900",
                  headerSubtitle: "text-neutral-500",
                  socialButtonsBlockButton: "bg-neutral-100 border-neutral-200 text-neutral-900 hover:bg-neutral-200",
                  formFieldLabel: "text-neutral-700",
                  formFieldInput: "bg-neutral-50 border-neutral-200 text-neutral-900",
                  formButtonPrimary: "bg-neutral-900 hover:bg-neutral-800",
                  footerActionLink: "text-neutral-900 hover:text-neutral-700",
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
