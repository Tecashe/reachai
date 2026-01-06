// import { Suspense } from "react"
// import { WarmupDashboard } from "@/components/warmup/warmup-dashboard"

// export const metadata = {
//   title: "Email Warmup - mailfra",
//   description: "Monitor and manage email warmup for optimal deliverability",
// }

// export default function WarmupPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold">Email Warmup</h1>
//         <p className="text-muted-foreground">Build domain reputation with our intelligent warmup system</p>
//       </div>

//       <Suspense fallback={<div>Loading warmup dashboard...</div>}>
//         <WarmupDashboard />
//       </Suspense>
//     </div>
//   )
// }


// import { Suspense } from "react"
// import { EnhancedWarmupDashboard } from "@/components/warmup/warmup-dashboard"
// import { Loader2 } from "lucide-react"

// export const metadata = {
//   title: "Email Warmup - ReachAI",
//   description: "Monitor and manage email warmup for optimal deliverability",
// }

// export default function WarmupPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
//           Email Warmup
//         </h1>
//         <p className="text-muted-foreground mt-1">Build domain reputation with our intelligent warmup system</p>
//       </div>

//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//           </div>
//         }
//       >
//         <EnhancedWarmupDashboard />
//       </Suspense>
//     </div>
//   )
// }

// import { Suspense } from "react"
// import { EnhancedWarmupDashboard } from "@/components/warmup/warmup-dashboard"
// import { Loader2 } from "lucide-react"

// export const metadata = {
//   title: "Email Warmup - Mailfra",
//   description: "Monitor and manage email warmup for optimal deliverability with Mailfra",
// }

// export default function WarmupPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Email Warmup</h1>
//         <p className="text-muted-foreground mt-1">Build domain reputation with our intelligent warmup system</p>
//       </div>

//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//           </div>
//         }
//       >
//         <EnhancedWarmupDashboard />
//       </Suspense>
//     </div>
//   )
// }

import { Suspense } from "react"
import { EnhancedWarmupDashboard } from "@/components/warmup/warmup-dashboard"
import { WaveLoader } from "@/components/loader/wave-loader"

export const metadata = {
  title: "Email Warmup - Mailfra",
  description: "Monitor and manage email warmup for optimal deliverability with Mailfra",
}

export default function WarmupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Email Warmup</h1>
        <p className="text-muted-foreground mt-1">Build domain reputation with our intelligent warmup system</p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <WaveLoader color="bg-foreground" size="lg" speed="normal" />
          </div>
        }
      >
        <EnhancedWarmupDashboard />
      </Suspense>
    </div>
  )
}
