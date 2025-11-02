// import { SignUp } from "@clerk/nextjs"

// export default function SignUpPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Get started</h1>
//           <p className="mt-2 text-gray-600">Create your ReachAI account and start writing better emails</p>
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
//             <span className="text-3xl font-bold">ReachAI</span>
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
//               "ReachAI increased our reply rate from 8% to 24% in just two weeks. Best investment we've made this year."
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

//         <div className="relative z-10 text-sm text-blue-100">© 2025 ReachAI. All rights reserved.</div>
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
//               <span className="text-2xl font-bold">ReachAI</span>
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


import { SignUp } from "@clerk/nextjs"
import { dark } from '@clerk/themes'
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left side - Image */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-[#0a0a0a]">
        <div className="relative w-full max-w-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 blur-3xl rounded-full" />
          <img
            src="/oauth.png"
            alt="Sign up"
            className="relative w-full h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right side - Sign up form */}
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
          <SignUp
            appearance={{
              baseTheme: dark,
            }}
          />
        </div>
      </div>
    </div>
  )
}