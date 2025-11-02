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
import { dark } from '@clerk/themes'

import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left side - Image */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-[#0a0a0a]">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />
          <img
            src="/oauth.png"
            alt="Sign in"
            className="relative w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right side - Sign in form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#0a0a0a]">
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
         <SignIn
            appearance={{
              baseTheme: dark,
            }}
          />
        </div>
      </div>
    </div>
  )
}



