// import { SignIn } from "@clerk/nextjs"

// export default function SignInPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
//           <p className="mt-2 text-gray-600">Sign in to your ReachAI account</p>
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
//             <span className="text-3xl font-bold">ReachAI</span>
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

//         <div className="relative z-10 text-sm text-blue-100">© 2025 ReachAI. All rights reserved.</div>
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
//               <span className="text-2xl font-bold">ReachAI</span>
//             </div>
//           </div>

//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold">Welcome back</h1>
//             <p className="text-muted-foreground">Sign in to your ReachAI account</p>
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
//               <span className="text-2xl font-bold text-white">ReachAI</span>
//             </div>
//           </div>

//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold text-white">Welcome back</h1>
//             <p className="text-gray-400">Sign in to your ReachAI account</p>
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

import { dark } from "@clerk/themes"
import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft, Shield, Zap, Users, Star } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    quote: "The most intuitive platform I've ever used. Saved us countless hours!",
    author: "Sarah Chen",
    role: "Product Manager",
    rating: 5,
  },
  {
    quote: "Security and speed combined. Everything we needed in one place.",
    author: "Marcus Rodriguez",
    role: "CTO",
    rating: 5,
  },
  {
    quote: "Game-changer for our team. Highly recommend to everyone!",
    author: "Emma Thompson",
    role: "Design Lead",
    rating: 5,
  },
]

const features = [
  { icon: Shield, text: "Bank-level security", color: "from-blue-500 to-cyan-500" },
  { icon: Zap, text: "Lightning fast", color: "from-purple-500 to-pink-500" },
  { icon: Users, text: "10K+ happy users", color: "from-green-500 to-emerald-500" },
]

export default function SignInPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-40 right-20 w-16 h-16 rounded-lg bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 animate-float-delayed"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-24 h-24 rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-14 h-14 rotate-45 bg-pink-500/10 backdrop-blur-sm border border-pink-500/20 animate-float-delayed"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/20 animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="hidden lg:flex items-center justify-center p-12 bg-[#0a0a0a] relative">
        <div className="relative w-full max-w-lg space-y-8">
          {/* Background gradient blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />

          {/* Feature cards - floating */}
          <div className="relative space-y-6 z-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-white">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial carousel */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 mt-8">
            <div className="relative min-h-[180px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === currentTestimonial ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial indicators */}
            <div className="flex gap-2 justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial ? "w-8 bg-cyan-500" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#0a0a0a] relative">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 text-[#a1a1aa] hover:text-[#e4e4e7] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10 relative z-10">
            <SignIn
              appearance={{
                baseTheme: dark,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
