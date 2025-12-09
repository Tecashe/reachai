// import { SignIn } from "@clerk/nextjs"

// export default function SignInPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
//           <p className="mt-2 text-gray-600">Sign in to your mailfra account</p>
//         </div>
//         <SignIn
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

// import { SignIn } from "@clerk/nextjs"
// import Link from "next/link"
// import { Sparkles, ArrowLeft, Zap, Target, TrendingUp } from "lucide-react"

// export default function SignInPage() {
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
//             <h1 className="text-4xl font-bold leading-tight">Welcome back to the future of cold email</h1>
//             <p className="text-lg text-blue-100">
//               Sign in to continue crafting hyper-personalized emails that actually get replies.
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
//                 <TrendingUp className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="font-semibold">3x Reply Rates</p>
//                 <p className="text-sm text-blue-100">AI-powered personalization</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
//                 <Zap className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="font-semibold">10x Faster Outreach</p>
//                 <p className="text-sm text-blue-100">Automated research & writing</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
//                 <Target className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="font-semibold">95% Deliverability</p>
//                 <p className="text-sm text-blue-100">Smart send optimization</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="relative z-10 text-sm text-blue-100">© 2025 mailfra. All rights reserved.</div>
//       </div>

//       {/* Right side - Sign in form */}
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
//             <h1 className="text-3xl font-bold">Welcome back</h1>
//             <p className="text-muted-foreground">Sign in to your mailfra account</p>
//           </div>

//           <SignIn
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
//             Don't have an account?{" "}
//             <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
//               Sign up for free
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// import { SignIn } from "@clerk/nextjs"
// import Link from "next/link"
// import { Sparkles, ArrowLeft } from "lucide-react"

// export default function SignInPage() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left side - Image */}
//       <div className="hidden lg:block relative overflow-hidden bg-gray-100">
//         <img
//           src="/oauth.png"
//           alt="Sign in"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Right side - Sign in form */}
//       <div className="flex items-center justify-center p-6 sm:p-12 bg-black">
//         <div className="w-full max-w-md space-y-8">
//           <div className="lg:hidden text-center mb-8">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to home</span>
//             </Link>
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
//                 <Sparkles className="h-6 w-6 text-white" />
//               </div>
//               <span className="text-2xl font-bold text-white">mailfra</span>
//             </div>
//           </div>

//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold text-white">Welcome back</h1>
//             <p className="text-gray-400">Sign in to your mailfra account</p>
//           </div>

//           <SignIn
//             appearance={{
//               baseTheme: undefined,
//               variables: {
//                 colorPrimary: "#3b82f6",
//                 colorBackground: "#000000",
//                 colorInputBackground: "#18181b",
//                 colorInputText: "#ffffff",
//                 colorText: "#ffffff",
//                 colorTextSecondary: "#9ca3af",
//                 colorDanger: "#ef4444",
//                 borderRadius: "0.5rem",
//               },
//               elements: {
//                 rootBox: "mx-auto",
//                 card: "bg-black shadow-xl border border-zinc-800",
//                 headerTitle: "hidden",
//                 headerSubtitle: "hidden",
//                 formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
//                 formFieldInput: "bg-zinc-900 border-zinc-800 text-white",
//                 footerActionLink: "text-blue-400 hover:text-blue-300",
//                 identityPreviewText: "text-white",
//                 formFieldLabel: "text-gray-300",
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import { SignIn } from '@clerk/clerk-react'



// import { dark } from '@clerk/themes'

// import { SignIn } from "@clerk/nextjs"
// import Link from "next/link"
// import { Sparkles, ArrowLeft } from "lucide-react"

// export default function SignInPage() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
//       {/* Left side - Image */}
//       <div className="hidden lg:flex items-center justify-center p-12 bg-[#0a0a0a]">
//         <div className="relative w-full max-w-lg">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />
//           <img
//             src="/oauth.png"
//             alt="Sign in"
//             className="relative w-full h-auto object-contain drop-shadow-2xl"
//           />
//         </div>
//       </div>

//       {/* Right side - Sign in form */}
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
//          <SignIn
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
import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"

const headlines = [
  { main: "Welcome back", sub: "Continue scaling your outreach where you left off" },
  { main: "Your leads await", sub: "Dozens of warm conversations ready for follow-up" },
  { main: "Keep the momentum", sub: "Smart sequences have been working while you slept" },
  { main: "Close more deals", sub: "Your pipeline is warmer than ever" },
]

export default function SignInPage() {
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
              <pattern id="grid-signin" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-signin)" />
          </svg>
        </div>

        {/* Gradient blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 blur-3xl rounded-full" />

        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
            <Mail className="h-5 w-5 text-[#0a0a0a]" />
          </div>
          <span className="font-semibold text-xl text-white">ColdFlow</span>
        </div>

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
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-[#0a0a0a]"
                  />
                ))}
              </div>
              <div>
                <div className="text-sm font-medium text-white">10,000+ teams</div>
                <div className="text-xs text-white/50">trust ColdFlow</div>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">47%</div>
                <div className="text-xs text-white/50">Open rate</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">12%</div>
                <div className="text-xs text-white/50">Reply rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Light with Sign in form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="absolute top-6 right-6 hidden lg:flex items-center gap-4">
          <span className="text-sm text-neutral-500">{"Don't have an account?"}</span>
          <Link href="/sign-up" className="text-sm font-medium text-neutral-900 hover:underline">
            Sign up
          </Link>
        </div>

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
            <SignIn
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

        {/* Bottom trust indicators */}
        <div className="absolute bottom-6 left-8 right-8 hidden lg:flex items-center justify-center gap-6 text-xs text-neutral-400">
          <span>SOC 2 Compliant</span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>GDPR Ready</span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span>256-bit encryption</span>
        </div>
      </div>
    </div>
  )
}
